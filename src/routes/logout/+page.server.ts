import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    default: async ({locals}) =>{
        await locals.pb.authStore.clear()
        locals.user = undefined
        throw redirect(303,"/login")
    }}
