
import { FluentBundle, FluentResource, type FluentVariable } from "@fluent/bundle"

export const DEFAULT_LANG = "en";
export const LANG_LOCALES = {
    "en": ["en-US"],
    "fi": ["fi-FI"],
};
export type LangOption = keyof typeof LANG_LOCALES;

async function fetchTransFile(fileName: string, lang: LangOption): Promise<FluentResource> {
    let data;
    try {
        data = await import(`$lib/translations/${lang}/${fileName}`);
    }
    catch {
        // If this fails, that means the default language is missing translations, 
        // and that should break (because it does)
        data = await import(`$lib/translations/${DEFAULT_LANG}/${fileName}`);
    }
    return new FluentResource(data);
}

function getSelectedLanguage(): LangOption {
    const selected = window.localStorage.getItem("geode-selected-language");
    if (selected && (selected in LANG_LOCALES)) {
        return selected as LangOption;
    }
    // todo
    return DEFAULT_LANG;
}

export class Translations {
    bundle: FluentBundle;

    constructor(bundle: FluentBundle) {
        this.bundle = bundle;
    }

    get(id: string, args?: Record<string, FluentVariable>): string {
        const [parent, attr] = id.includes(".") ? id.split(".") : [id, undefined];
        const m = this.bundle.getMessage(parent);
        if (!m) return `MISSING-TRANSLATION(${parent})`;
        let value = m.value;
        if (attr) {
            if (!(attr in m.attributes)) {
                return `MISSING-ATTRIBUTE(${parent}.${attr})`;
            }
            value = m.attributes[attr];
        }
        if (!value) {
            return `MISSING-TRANSLATION(${id})`;
        }
        return this.bundle.formatPattern(value, args);
    }
}

export async function getTranslations(files: string[], lang?: LangOption): Promise<Translations> {
    lang ??= getSelectedLanguage();
    const bundle = new FluentBundle([lang, ...LANG_LOCALES[lang]]);
    bundle.addResource(await fetchTransFile("global.ftl", lang));
    for (const file of files) {
        bundle.addResource(await fetchTransFile(file, lang));
    }
    return new Translations(bundle);
}
