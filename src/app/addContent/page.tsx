import ButtonSecondary from '@/components/elements/buttonSecondary'
import Card from '@/components/elements/card/Card'
import EditorContent from '@/components/fragemnts/editorContent/EditorContent'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <DefaultLayout>
            <Card padding='p-3'>

                <div className="flex gap-3">
                    <ButtonSecondary className='py-1 px-4 rounded-lg'>
                        Instagram
                    </ButtonSecondary>
                    <ButtonSecondary className='py-1 px-4 rounded-lg'>
                        Tiktok
                    </ButtonSecondary>
                </div>

                <div className="content mt-4">

                </div>

                <EditorContent />
            </Card>
        </DefaultLayout>
    )
}

export default page