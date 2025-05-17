import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/Api";
import toast from "react-hot-toast";

function useLogin() {

    const queryClient = useQueryClient();

    const { mutate,isPending, error } = useMutation({
     mutationFn: login,
     onSuccess: () => {
      toast.success('Login Successfull')
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
     },
   });
   return { error, isPending, loginMutation: mutate}
}

export default useLogin