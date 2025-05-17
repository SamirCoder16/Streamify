import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { logout } from "../lib/Api";

const useLogout = () => {
   const queryClient  = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success('Logout Successfull')
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }
  });

  return { error, isPending, logoutMutation: mutate}
}

export default useLogout