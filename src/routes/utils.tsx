import type { LucideIcon } from "lucide-react";
import type { RouteObject } from "react-router";

export type AppRoute = {
    path: string;
    element: React.ReactNode;
    children?: NavbarMenuItem[];
}

type NavbarMenuItem = {
    label: string;
    icon: LucideIcon;
    path: string;
    element?: React.ReactNode;
    children?: NavbarSubMenuItem[];
}

type NavbarSubMenuItem = {
    label: string;
    path: string;
    element: React.ReactNode;
    hidden?: boolean;
}

export type NavbarMenu = {
    label: string;
    icon: LucideIcon;
    initiallyOpened?: boolean;
    link?: string;
    submenus?: NavbarSubMenu[];
}

type NavbarSubMenu = {
    label: string;
    link: string
}

// This converts appMenu into an array React Router understands.
export const generateRouterConfig = (appMenu: AppRoute[]): RouteObject[] => {

    const routes: RouteObject[] = []

    for (const appRoute of appMenu) {

        // create a route object
        const route: RouteObject = {
            path: `/${normalizePath(appRoute.path)}`,
            element: appRoute.element,
            children: []
        }

        // push the menu items into route.children
        for (const appRouteMenuItem of appRoute.children ?? []) {
            route.children?.push({
                path: normalizePath(appRouteMenuItem.path),
                element: appRouteMenuItem.element
            })

            // push the sub-menu items into rote.children
            for (const appRouteSubMenuItem of appRouteMenuItem.children ?? []) {
                route.children?.push({
                    path: `${normalizePath(appRouteMenuItem.path)}/${normalizePath(appRouteSubMenuItem.path)}`,
                    element: appRouteSubMenuItem.element
                })
            }
        }

        // push the route into the generated routes array
        routes.push(route)

    }

    return routes

}

// Builds the sidebar menu for the current top-level area, based on the current URL.
export const generateNavbarMenu = (appRoutes: AppRoute[], appUrl: string): NavbarMenu[] => {

    // Generate a map of app routes for quick loop
    const appRoutesMap: Record<string, AppRoute> = {}
    appRoutes.forEach((route) => {
        appRoutesMap[normalizePath(route.path)] = route
    })

    const navbarMenu: NavbarMenu[] = []

    // Split the URL into segments and filter out valid and non-falsy segments
    const urlSegments = normalizePath(appUrl).split('/').filter(Boolean)

    // return for no valid URL segments
    if (urlSegments.length === 0) {
        return navbarMenu
    }

    const appRoute = appRoutesMap[normalizePath(urlSegments[0])]

    // return if appRoute doesn't have any children routes
    if (!appRoute || !appRoute.children || appRoute.children.length===0) {
        return navbarMenu
    }

    for (const menuItem of appRoute.children) {

        const menu: NavbarMenu = {
            label: menuItem.label,
            icon: menuItem.icon,
            link: createHashedLink(appRoute.path, menuItem.path)
        }

        // if URL segment matches the menuItem path, keep it initially opened
        if(urlSegments.length>1 && menuItem.path===urlSegments[1]) {
            menu.initiallyOpened = true
        }

        // if menuItem has children, create submenu item
        if (menuItem.children && menuItem.children.length>0) {
            menu.submenus = menuItem.children
                .filter((subMenuItem) => !subMenuItem.hidden)
                .map((subMenuItem) => ({
                    label: subMenuItem.label,
                    link: createHashedLink(appRoute.path, menuItem.path, subMenuItem.path)
                }))

            // remove direct-link for submenus
            delete menu.link
        }

        navbarMenu.push(menu)

    }

    return navbarMenu

}

/**
 * Normalizes a URL path by converting it to lowercase and removing all leading and trailing slashes,
 * while preserving path parameters (segments starting with ':').
 *
 * @param path - The input path string to normalize.
 * @returns The normalized path in lowercase, without leading or trailing slashes, but with path parameters preserved.
 *
 * @example
 * normalizePath('/Some/Path/') // 'some/path'
 * normalizePath('view-bookings/:facilityId/:bookingDate') // 'view-bookings/:facilityId/:bookingDate'
 * normalizePath('/Admin/:id/Settings') // 'admin/:id/settings'
 */
export const normalizePath = (path: string): string => {
    return path
        .replace(/^\/+|\/+$/g, '')
        .split('/')
        .map((segment) => (segment.startsWith(':') ? segment : segment.toLowerCase()))
        .join('/')
}

export const createHashedLink = (...path: string[]): string => {
    return `/${path.map(normalizePath).join('/')}`
}
