
import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    event.locals.pb = new PocketBase('http://127.0.0.1:8090');

    // load the store data from the request cookie string
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
    const anonymousRoutes = ["/register", "/login"]

    try {
        // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
        event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh();
        event.locals.user = structuredClone(event.locals.pb.authStore.record)
    } catch (_) {
        // clear the auth store on failed refresh
        event.locals.pb.authStore.clear();

    }

    if (!event.locals.pb.authStore.isValid && !anonymousRoutes.includes(event.url.pathname) && event.url.pathname != "/") {
        console.log("im not authenticated");
        
        throw redirect(303, "/")
    }

    console.log("event.url.pathname", event.url.pathname == "/register");
    console.log("event.locals.pb.authStore.isValid", event.locals.pb.authStore.isValid)
    if (event.locals.pb.authStore.isValid
        && anonymousRoutes.includes(event.url.pathname)
    ) {
        console.log("I should not go here");

        throw redirect(303, "/")
    }

    const response = await resolve(event);

    // send back the default 'pb_auth' cookie to the client with the latest store state
    response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

    return response;
}