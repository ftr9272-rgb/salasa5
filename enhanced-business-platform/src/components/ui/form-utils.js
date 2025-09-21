import * as React from "react"
import { Controller } from "react-hook-form"

export const FormFieldContext = React.createContext({})

export const FormField = ({ ...props }) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export const FormItemContext = React.createContext({})

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  // Note: callers must ensure useFormContext and useFormState are available in the component tree.
  // We keep the implementation minimal here and re-import form state helpers in the component file if needed.
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
  }
}
