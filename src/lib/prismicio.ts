import * as prismic from '@prismicio/client';
import { type CreateClientConfig, enableAutoPreviews } from '@prismicio/svelte/kit';
import sm from '../../slicemachine.config.json';

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
	import.meta.env.VITE_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * Route resolvers
 */
const routes: prismic.ClientConfig['routes'] = [
	{ type: 'page', path: '/', uid: 'home' },
	{ type: 'page', path: '/:uid' },
	{ type: 'lportfolio', path: '/portfolio/:uid' },
	{ type: 'projects', path: '/projects/:uid' }
];

/**
 * Creates a Prismic client for the project.
 */
export const createClient = ({ cookies, ...config }: CreateClientConfig = {}) => {
	const client = prismic.createClient(repositoryName, {
		routes,

		// 🔥 ISSO É O PONTO-CHAVE
		fetchOptions: {
			cache: 'no-store'
		},

		...config
	});

	enableAutoPreviews({ client, cookies });

	return client;
};
