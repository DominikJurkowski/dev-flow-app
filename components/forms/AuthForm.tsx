"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, DefaultValues, FieldValues, Path, Resolver, SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import ROUTES from "@/constants/routes"
import Link from "next/link"

interface AuthFormProps<T extends FieldValues> {
    formType: "SIGN_IN" | "SIGN_UP"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.ZodType<T, any, any>
    defaultValues: T
    onSubmit: (data: T) => Promise<{success: boolean}>
}

export function AuthForm<T extends FieldValues>({
    formType,
    schema,
    defaultValues,
    onSubmit,
}: AuthFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues: defaultValues as DefaultValues<T>
  })

 const handleSubmit: SubmitHandler<T> = async () => {
    // TOOD: Auth action needed to be added
 } 

 const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up"

  return (
    <>
    <form id="form-rhf-demo" className="mt-10 space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldGroup>
        {Object.keys(defaultValues).map((field, index) => (
            <Controller
            key={field}
            name={field as Path<T>}
            control={form.control}
            render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="paragraph-medium text-dark400_light700" htmlFor="form-rhf-demo-title">
                {field.name === 'email ' ? 'Email Address' : field.name.charAt(0).toUpperCase() + field.name.slice(1) }
                </FieldLabel>
                <Input

                {...field}
                required
                type={field.name === 'password' ? 'password' : 'text'}
                className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder={field.name === 'email ' ? 'Enter your email address' : field.name }
                autoComplete="off"
                />
                {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
                )}
            </Field>
            )}
        />
        ))}
        
        </FieldGroup>
    </form>
    <Field orientation="vertical" className="mt-6">
        <Button type="submit" form="form-rhf-demo" className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 !text-light-900 font-inter cursor-pointer" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? buttonText === 'Sign In' ? 'Signing In...' : 'Signing Up...' : buttonText}
        </Button>
        {formType === "SIGN_IN" ? (<p>
            Don&apos;t have an account? {" "} <Link href={ROUTES.SIGN_UP} className="paragraph-semibold primary-text-gradient hover:underline">Sign In</Link>
        </p>) : (<p>
            Already have an account? {" "} <Link href={ROUTES.SIGN_IN} className="paragraph-semibold primary-text-gradient hover:underline">Sign In</Link>
        </p>)}
    </Field>
  </>
  )
}