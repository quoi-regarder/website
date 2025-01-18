export const useNotifications = () => {
  const toast = useToast()

  const success = (title: string, message: string) => {
    toast.add({
      title,
      description: message,
      icon: 'i-heroicons-check-circle',
      color: 'success'
    })
  }

  const error = (title: string, message: string) => {
    toast.add({
      title,
      description: message,
      icon: 'i-heroicons-exclamation-triangle',
      color: 'error'
    })
  }

  const info = (title: string, message: string) => {
    toast.add({
      title,
      description: message,
      icon: 'i-heroicons-information-circle',
      color: 'info'
    })
  }

  return {
    success,
    error,
    info
  }
}
