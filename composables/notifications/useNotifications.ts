export const useNotifications = () => {
  const toast = useToast()

  const success = (title: string, message: string) => {
    const isDuplicate = handleDuplicate(title, message)

    if (isDuplicate) {
      return
    }

    toast.add({
      title,
      description: message,
      icon: 'i-heroicons-check-circle',
      color: 'success'
    })
  }

  const error = (title: string, message: string) => {
    const isDuplicate = handleDuplicate(title, message)

    if (isDuplicate) {
      return
    }

    toast.add({
      title,
      description: message,
      icon: 'i-heroicons-exclamation-triangle',
      color: 'error'
    })
  }

  const info = (title: string, message: string) => {
    const isDuplicate = handleDuplicate(title, message)

    if (isDuplicate) {
      return
    }

    toast.add({
      title,
      description: message,
      icon: 'i-heroicons-information-circle',
      color: 'info'
    })
  }

  const handleDuplicate = (title: string, message: string) => {
    const toasts = toast.toasts.value

    if (toasts.length === 0) {
      return false
    }

    return toasts.some((toast) => {
      return toast.title === title && toast.description === message
    })
  }

  return {
    success,
    error,
    info
  }
}
