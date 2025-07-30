import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  const getIcon = (variant: string) => {
    switch (variant) {
      case 'success':
      case 'default':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
      case 'destructive':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start space-x-3 p-4">
              <div className="flex-shrink-0">
                {getIcon(variant || 'default')}
              </div>
              <div className="flex-1 min-w-0">
                {title && <ToastTitle className="font-semibold text-gray-900">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-sm text-gray-600 mt-1">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
