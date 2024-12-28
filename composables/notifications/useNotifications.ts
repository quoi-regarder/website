export const useNotifications = () => {
  const toast = useToast()

  const success = (title: string, message: string) => {
    toast.add({
      title,
      description: message,
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
  }

  const error = (title: string, message: string) => {
    toast.add({
      title,
      description: message,
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red'
    })
  }

  const info = (title: string, message: string) => {
    toast.add({
      title,
      description: message,
      icon: 'i-heroicons-information-circle',
      color: 'blue'
    })
  }

  return {
    success,
    error,
    info
  }
}
