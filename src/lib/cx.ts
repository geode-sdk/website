import { twMerge } from 'tailwind-merge';
import clsx, { type ClassValue } from "clsx";

const cx = (...args: ClassValue[]) => twMerge(clsx(...args));

export default cx;
