            <div>
                <div className="text-xl font-semibold mb-4">
                    {chapter.title}
                </div>
                <div className="prose dark:prose-invert prose-sm max-w-none space-y-4">
                    <div dangerouslySetInnerHTML={{ __html: chapter.description! }} />
                </div>
            </div> 