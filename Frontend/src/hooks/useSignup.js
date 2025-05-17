import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signup } from '../lib/Api'
import toast from 'react-hot-toast';
const useSignup = () => {

  const queryClient = useQueryClient();
  
   const { mutate, isPending , error} = useMutation({
    mutationFn: signup,
    onSuccess: () =>{ 
      toast.success('Signup Successfull')
      queryClient.invalidateQueries({ queryKey: ["authUser"]})
    }
  });
  return { error,isPending, signupMutation:mutate }
}

export default useSignup