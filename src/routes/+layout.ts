import { generateBundles } from '$lib/translations/fluent';
import { createSvelteFluent } from '@nubolab-ffwd/svelte-fluent';

export function load(event) {
	return {
		...event.data,
		fluent: createSvelteFluent(generateBundles(event.data.locale))
	};
}
