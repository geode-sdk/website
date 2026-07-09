import {
    IndexError,
    IndexClient,
    type Paginated,
    type GetModVersionsParams,
    SetTokensResult,
} from "$lib/api/index-repository.js";
import { getCachedTags } from "$lib/server/cache.js";
import { toIntSafe } from "$lib/api/helpers.js";
import type { ServerTag } from "$lib/api/models/base.js";
import type { ModStatus, ServerModVersion, ServerModVersionThreadComment } from "$lib/api/models/mod-version.js";
import type { Actions, PageServerLoad } from "./$types.js";
import { error, fail } from "@sveltejs/kit";
import type { ServerMod, ServerModDeprecation } from "$lib/api/models/mod";
import { tryCreateAuthenticatedClient } from "$lib/server";

export const actions: Actions = {
    update_mod_version: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const client = new IndexClient({ fetch });

        if ((await client.trySetTokens(cookies)) === SetTokensResult.UNSET) {
            return fail(401, { message: "You are not authenticated" });
        }

        const data = await request.formData();
        const status = data.get("status") as ModStatus;
        if (!status || typeof status != "string") {
            return fail(400, { message: "invalid status" });
        }

        const version = data.get("mod_version");
        if (!version || typeof version != "string") {
            return fail(400, { message: "missing version" });
        }

        const info = (data.get("info") as string | null) ?? undefined;

        try {
            await client.updateModVersion(id, version, { status, info });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
        }

        return { success: true };
    },
    update_mod: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const client = new IndexClient({ fetch });

        if ((await client.trySetTokens(cookies)) === SetTokensResult.UNSET) {
            return fail(401, { message: "You are not authenticated" });
        }

        const data = await request.formData();

        // checkbox are "on" if true, otherwise not present
        const featured = data.has("featured");

        try {
            await client.updateMod(id, { featured });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
        }

        return { success: true };
    },
    create_version: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const client = new IndexClient({ fetch });

        if ((await client.trySetTokens(cookies)) === SetTokensResult.UNSET) {
            return fail(401, { message: "You are not authenticated" });
        }

        const data = await request.formData();

        const download_link = data.get("download_link");
        if (!download_link || typeof download_link != "string") {
            return fail(400, { message: "invalid download_link" });
        }

        try {
            await client.createModVersion(id, { download_link });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
        }

        return { success: true };
    },
    add_developer: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const client = new IndexClient({ fetch });

        if ((await client.trySetTokens(cookies)) === SetTokensResult.UNSET) {
            return fail(401, { message: "You are not authenticated" });
        }

        const data = await request.formData();

        const developer = data.get("developer");
        if (!developer || typeof developer != "string") {
            return fail(400, { message: "invalid developer" });
        }

        try {
            await client.addDeveloper(id, { username: developer });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
        }

        return { success: true };
    },
    remove_developer: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const client = new IndexClient({ fetch });

        if ((await client.trySetTokens(cookies)) === SetTokensResult.UNSET) {
            return fail(401, { message: "You are not authenticated" });
        }

        const data = await request.formData();

        const developer = data.get("developer");
        if (!developer || typeof developer != "string") {
            return fail(400, { message: "invalid developer" });
        }

        try {
            await client.removeDeveloper(id, developer);
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
        }

        return { success: true };
    },
    comment: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const client = await tryCreateAuthenticatedClient(cookies, fetch);
        const authStatus = client.lastAuthStatus();

        if (authStatus === SetTokensResult.UNSET) {
            return fail(401, { action: "comment", error: "You need to be authenticated to comment" });
        }

        const data = await request.formData();

        const version = data.get("version");
        if (!version || typeof version != "string") {
            return fail(400, { action: "comment", error: "missing version" });
        }

        const comment = data.get("comment");
        if (!comment || typeof comment != "string" || comment.trim().length === 0) {
            return fail(400, { action: "comment", error: "Comment cannot be empty" });
        }

        const files = data.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

        let created;
        try {
            created = await client.createComment(id, version, { comment });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { action: "comment", error: e.message });
            }
            throw e;
        }

        if (files.length > 0) {
            try {
                await client.uploadCommentAttachments(id, version, created.id, files);
            } catch (e) {
                const msg = e instanceof IndexError ? e.message : "unknown error";
                return { action: "comment", success: true, attachmentError: `Comment posted, but attachments failed: ${msg}` };
            }
        }

        return { action: "comment", success: true };
    },
    edit_comment: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const client = await tryCreateAuthenticatedClient(cookies, fetch);
        const authStatus = client.lastAuthStatus();

        if (authStatus === SetTokensResult.UNSET) {
            return fail(401, { action: "edit_comment", error: "You need to be authenticated" });
        }

        const data = await request.formData();
        const version = data.get("version");
        const commentIdRaw = data.get("comment_id") as string | null;
        const comment = data.get("comment");

        if (!version || typeof version != "string") {
            return fail(400, { action: "edit_comment", error: "missing version" });
        }
        const commentId = toIntSafe(commentIdRaw);
        if (commentId == null) {
            return fail(400, { action: "edit_comment", error: "invalid comment id" });
        }
        if (!comment || typeof comment != "string" || comment.trim().length === 0) {
            return fail(400, { action: "edit_comment", error: "Comment cannot be empty", comment_id: commentId });
        }

        try {
            await client.updateComment(id, version, commentId, { comment });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { action: "edit_comment", error: e.message, comment_id: commentId });
            }
            throw e;
        }

        return { action: "edit_comment", success: true, comment_id: commentId };
    },
    delete_comment: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const client = await tryCreateAuthenticatedClient(cookies, fetch);
        const authStatus = client.lastAuthStatus();

        if (authStatus === SetTokensResult.UNSET) {
            return fail(401, { action: "delete_comment", error: "You need to be authenticated" });
        }

        const data = await request.formData();
        const version = data.get("version");
        const commentId = toIntSafe(data.get("comment_id") as string | null);

        if (!version || typeof version != "string") {
            return fail(400, { action: "delete_comment", error: "missing version" });
        }
        if (commentId == null) {
            return fail(400, { action: "delete_comment", error: "invalid comment id" });
        }

        try {
            await client.deleteComment(id, version, commentId);
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { action: "delete_comment", error: e.message, comment_id: commentId });
            }
            throw e;
        }

        return { action: "delete_comment", success: true, comment_id: commentId };
    },
    update_lock: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const client = await tryCreateAuthenticatedClient(cookies, fetch);
        const authStatus = client.lastAuthStatus();

        if (authStatus === SetTokensResult.UNSET) {
            return fail(401, { action: "update_lock", error: "You need to be authenticated" });
        }

        const data = await request.formData();
        const version = data.get("version");
        const lock = data.get("lock");

        if (!version || typeof version != "string") {
            return fail(400, { action: "update_lock", error: "missing version" });
        }
        if (lock !== "none" && lock !== "internal" && lock !== "locked") {
            return fail(400, { action: "update_lock", error: "invalid lock value" });
        }

        try {
            await client.updateSubmission(id, version, { lock });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { action: "update_lock", error: e.message });
            }
            throw e;
        }

        return { action: "update_lock", success: true };
    },
    add_attachment: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const client = await tryCreateAuthenticatedClient(cookies, fetch);
        const authStatus = client.lastAuthStatus();

        if (authStatus === SetTokensResult.UNSET) {
            return fail(401, { action: "add_attachment", error: "You need to be authenticated" });
        }

        const data = await request.formData();
        const version = data.get("version");
        const commentId = toIntSafe(data.get("comment_id") as string | null);
        const files = data.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

        if (!version || typeof version != "string") {
            return fail(400, { action: "add_attachment", error: "missing version" });
        }
        if (commentId == null) {
            return fail(400, { action: "add_attachment", error: "invalid comment id" });
        }
        if (files.length === 0) {
            return fail(400, { action: "add_attachment", error: "No files selected", comment_id: commentId });
        }

        try {
            await client.uploadCommentAttachments(id, version, commentId, files);
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { action: "add_attachment", error: e.message, comment_id: commentId });
            }
            throw e;
        }

        return { action: "add_attachment", success: true, comment_id: commentId };
    },
    delete_attachment: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const client = await tryCreateAuthenticatedClient(cookies, fetch);
        const authStatus = client.lastAuthStatus();

        if (authStatus === SetTokensResult.UNSET) {
            return fail(401, { action: "delete_attachment", error: "You need to be authenticated" });
        }

        const data = await request.formData();
        const version = data.get("version");
        const commentId = toIntSafe(data.get("comment_id") as string | null);
        const attachmentId = toIntSafe(data.get("attachment_id") as string | null);

        if (!version || typeof version != "string") {
            return fail(400, { action: "delete_attachment", error: "missing version" });
        }
        if (commentId == null || attachmentId == null) {
            return fail(400, { action: "delete_attachment", error: "invalid id" });
        }

        try {
            await client.deleteCommentAttachment(id, version, commentId, attachmentId);
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { action: "delete_attachment", error: e.message, comment_id: commentId });
            }
            throw e;
        }

        return { action: "delete_attachment", success: true, comment_id: commentId };
    },
};

export const load: PageServerLoad = async ({ fetch, url, params, cookies }) => {
    const version_params: GetModVersionsParams = {
        page: toIntSafe(url.searchParams.get("page")),
        per_page: toIntSafe(url.searchParams.get("per_page")) ?? 10,
        status: (url.searchParams.get("status") as ModStatus) ?? "accepted",
    };

    const id = params.id;
    const version_string = url.searchParams.get("version") ?? "latest";

    const client = await tryCreateAuthenticatedClient(cookies, fetch);

    let mod: ServerMod | undefined = undefined;
    try {
        mod = await client.getMod(id);
        mod.developers = mod.developers.sort((a, b) => {
            if (a.is_owner) {
                return -1;
            } else if (b.is_owner) {
                return 1;
            }

            return a.id - b.id;
        });
    } catch (e) {
        return error(404, {
            message: "Mod not found.",
        });
    }

    let deprecation: ServerModDeprecation[] | undefined = undefined;
    try {
        deprecation = await client.getModDeprecation(id);
    } catch (e) {
        // probably don't make the whole thing fail if it's only about an error getting deprecations
    }

    let version = undefined;
    try {
        version = await client.getModVersion(id, version_string);
    } catch (e) {
        // fallback happens a little later
    }

    if (!version && version_string == "latest" && mod.versions.length) {
        // version info is probably just stuck in pending
        // this doesn't run all the time, as it may produce undesirable results
        try {
            version = await client.getModVersion(id, mod.versions[0].version);
        } catch (e) {
            // this really shouldn't fail, but whatever!
        }
    }

    if (!version) {
        return error(404, {
            message: "Version not found.",
        });
    }

    // override pending-only mods to be pending by default to show at least a version
    const mod_pending = mod.versions.length == 1 && version.status != "accepted";
    if (mod_pending && !url.searchParams.has("status")) {
        version_params.status = "pending";
    }

    const comment_page = toIntSafe(url.searchParams.get("comment_page")) ?? 1;
    const comment_per_page = 10;

    const thread = await client.getModVersionThread(id, version.version);
    let comments: Paginated<ServerModVersionThreadComment> | null = null;
    if (thread) {
        comments = await client.getModVersionThreadComments(id, version.version, comment_page, comment_per_page);
    }

    let versions: Paginated<ServerModVersion> = { count: 0, data: [] };
    try {
        versions = await client.getModVersions(id, version_params);
    } catch (e) {}

    let tags: ServerTag[] = [];
    try {
        tags = await getCachedTags(client);
    } catch (e) {}

    return { mod, deprecation, version, versions, tags, version_params, thread, comments, comment_page, comment_per_page };
};
