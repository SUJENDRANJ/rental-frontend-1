import { User, Briefcase } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "@/hooks"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function RoleSwitcher() {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const isHost = user?.role === 'host'

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {isHost ? (
            <Briefcase className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <User className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Switch role</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate("/")}>
          <User className="mr-2 h-4 w-4" />
          Renter View
        </DropdownMenuItem>
        {user.role === 'host' && (
          <DropdownMenuItem onClick={() => navigate("/host/dashboard")}>
            <Briefcase className="mr-2 h-4 w-4" />
            Host Dashboard
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
