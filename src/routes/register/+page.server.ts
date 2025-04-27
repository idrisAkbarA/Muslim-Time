
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;


export const actions = {
    register: async ({locals, request}) =>{
        const body = Object.fromEntries(await request.formData())
        console.log("body",body);
        // console.log("request",request);
        
        try {
            const data = {
                // id:crypto.randomUUID(),
                email: body.email,
                // emailVisibility: true, // if you want their email to be publicly visible
                password: body.password,
                passwordConfirm: body.password,
                name: body.name,
                // username:body.email
            };
            console.log("data",data);
            await locals.pb.collection('users').create(data)
            

        } catch (error) {
            // console.log(error);
            console.error(error.response.data);
        }

        throw redirect(303, "/login")
    }
}