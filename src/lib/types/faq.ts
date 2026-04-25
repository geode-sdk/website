export interface Faq {
    category: string;
    id: string;
    questions: FaqQuestion[];
}

export interface FaqQuestion {
    id: string;
    question: string;
    answer: string;
}