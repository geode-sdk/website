<script lang="ts">
    import { onMount } from "svelte";

    onMount(() => {
        self.__VM = self.__VM || [];
        self.__VM.push(function (admanager: any, scope: any) {
            scope.Instances.pageManager.on(
                "navigated",
                () => {
                    // this should trigger everytime you consider the content a "new page"
                    scope.Instances.pageManager.newPageSession(false);
                },
                false,
            );
        });
    });
</script>
