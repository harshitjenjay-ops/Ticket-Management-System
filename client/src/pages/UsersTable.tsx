import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Role } from "core/constants/role.ts";
import ErrorAlert from "@/components/ErrorAlert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

interface UsersTableProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UsersTable({ onEdit, onDelete }: UsersTableProps) {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get<{ users: User[] }>("/api/users");
      return data.users;
    },
  });

  if (error) {
    return <ErrorAlert message="Failed to fetch users" />;
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/40 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/40 hover:bg-transparent">
            <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/70">Name</TableHead>
            <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/70">Email</TableHead>
            <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/70">Role</TableHead>
            <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/70">Created</TableHead>
            <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/70">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/30">
                  <TableCell>
                    <Skeleton className="h-4 w-24 shimmer" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40 shimmer" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-14 rounded-full shimmer" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 shimmer" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded shimmer" />
                  </TableCell>
                </TableRow>
              ))
            : users?.map((user) => (
                <TableRow key={user.id} className="border-border/30 transition-colors duration-150 hover:bg-primary/[0.03]">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === Role.admin ? "default" : "secondary"}
                      className={
                        user.role === Role.admin
                          ? "bg-primary/15 text-primary border-primary/20 hover:bg-primary/20"
                          : ""
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-accent"
                        onClick={() => onEdit(user)}
                        aria-label={`Edit ${user.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {user.role !== Role.admin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onDelete(user)}
                          aria-label={`Delete ${user.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
