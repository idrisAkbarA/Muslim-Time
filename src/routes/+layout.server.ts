import type { LayoutServerLoad } from './$types';

export const load = (async ({locals}) => {
    console.log("locals.user", locals.user);
    
    if(locals.user){
        return {
            user: locals.user
        };
    }

    return {
        user: undefined
    }
}) satisfies LayoutServerLoad;