export const smoothScrollToElement = (target: HTMLElement): void => {
    document.querySelectorAll(".highlight-scrolled").forEach((e) => e.classList.remove("highlight-scrolled"));

    target.classList.add("highlight-scrolled");
    target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
};
