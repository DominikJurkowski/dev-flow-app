'use client';

import { AskQuestionSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import dynamic from 'next/dynamic';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { useRef } from 'react';
import z from 'zod';
import TagCard from '../cards/TagCard';

const Editor = dynamic(() => import('../editor/Editor'), {
  ssr: false,
});

const QuestionForm = () => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
    },
  });

  const handleFormSubmit = (data: z.infer<typeof AskQuestionSchema>) => {
    console.log(data);
    console.log('Form submitted');
    console.log(form.getValues());
  };

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);
    form.setValue('tags', newTags);

    if (newTags.length === 0) {
      form.setError('tags', { type: 'manual', message: 'At least one tag is required' });
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>, field: { value: string[] }) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();
      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue('tags', [...field.value, tagInput]);
        e.currentTarget.value = '';
        form.clearErrors('tags');
      } else if (tagInput && tagInput.length > 15) {
        form.setError('tags', { type: 'manual', message: 'Tag should be less than 15 characters' });
      } else if (field.value.includes(tagInput)) {
        form.setError('tags', { type: 'manual', message: 'Tag already exists' });
      }
    }
  };
  return (
    <>
      <form id="question-form" onSubmit={form.handleSubmit(handleFormSubmit)}>
        <FieldGroup>
          <Controller
            name={'title'}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Question Tittle</FieldLabel>
                <Input {...field} placeholder="Title" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                <FieldDescription>
                  {`Be specific and imagine you're asking a question to another person.`}
                </FieldDescription>
              </Field>
            )}
          />
          <Controller
            name={'content'}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Content</FieldLabel>
                <Editor editorRef={editorRef} fieldChange={field.onChange} markdown={field.value} />
                {/* <Textarea {...field} placeholder="Content" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />} */}
                <FieldDescription>Introduce the problem and expand on what you put in the title.</FieldDescription>
              </Field>
            )}
          />

          <Controller
            name={'tags'}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Tags</FieldLabel>
                <Input placeholder="Tags" onKeyDown={(e) => handleKeyDownInput(e, field)} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                <FieldDescription>
                  Add up to 3 tags to describe what your question is about. You need to press enter to add a new tag.
                </FieldDescription>
                {field.value.length > 0 && (
                  <div>
                    {field?.value?.map((tag: string) => (
                      <TagCard
                        key={tag}
                        _id={tag}
                        name={tag}
                        compact
                        remove
                        isButton
                        handleRemove={() => handleTagRemove(tag, field)}
                      />
                    ))}
                  </div>
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <Field orientation="vertical" className="mt-6">
        <Button
          type="submit"
          form="question-form"
          className="primary-gradient paragraph-medium rounded-2 text-light-900! font-inter min-h-12 w-full cursor-pointer px-4 py-3"
          //   disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </Field>
    </>
  );
};

export default QuestionForm;
