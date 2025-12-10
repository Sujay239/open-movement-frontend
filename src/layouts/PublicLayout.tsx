import DefaultNavbar from "@/components/blocks/default-navbar"
import type { AppRoute } from "@/routes/utils"
import { Outlet } from "react-router"

type PublicLayoutProps = {
    routes: AppRoute[]
}

const PublicLayout = ({ routes }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
        <DefaultNavbar routes={routes} />

        <main className="flex-1 container mx-auto px-4 overflow-x-hidden">
            <Outlet />
        </main>

        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} <a href="https://www.openmovements.com.au/" target="_blank" rel="noreferrer noopener">Open Movements</a> — All rights reserved.
        </footer>
    </div>
  )
}

export default PublicLayout
