import { readFileSync, writeFileSync } from 'fs';
import { htmlEscape } from 'escape-goat';
import * as feather from 'feather-icons';

let faqPage = readFileSync('src/faq/index.html').toString();
let questionsHtml = "";

const faq = [
    {
        question: "When will Geode be available for iOS?",
        answer: "Lorem ipsum."
    },
    {
        question: ":youshould:",
        answer: ":firee:"
    },
    {
        question: "h",
        answer: "i"
    }
]

const addQuestion = (question, answer) => {
    questionsHtml += `<section class="bg-gray-darker flex flex-col gap-4 items-center max-w-txt-or-vw">
        <h1 class="font-head text-2xl self-center">${htmlEscape(question)}</h1>
        <p>${htmlEscape(answer)}</p>
    </section>`;
};

async function main() {
    for (const item of faq) {
        addQuestion(item.question, item.answer);
    }

    faqPage = faqPage.replace("$FAQS_HTML", questionsHtml);

    writeFileSync("gen/faq/index.html", faqPage);
}
main();