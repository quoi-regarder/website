import type { ButtonProps } from '@nuxt/ui/dist/module'

export const useNotifications = () => {
  const toast = useToast()

  const success = (
    title: string,
    message: string,
    duration: number = 3000,
    actions: ButtonProps[] = []
  ) => {
    toast.add({
      title: title,
      description: message,
      icon: 'i-lucide:check-circle',
      color: 'success',
      duration: duration,
      actions: actions
    })
  }

  const error = (title: string, message: string) => {
    toast.add({
      title: title,
      description: message,
      icon: 'i-lucide:circle-x',
      color: 'error'
    })
  }

  const info = (title: string, message: string) => {
    toast.add({
      title: title,
      description: message,
      icon: 'i-lucide:info',
      color: 'info'
    })
  }

  return {
    success,
    error,
    info
  }
}
