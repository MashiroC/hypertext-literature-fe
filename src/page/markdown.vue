<template>
    <div>
        <mdtest v-model="mdData"/>
        <mavon-editor v-model="mdData" :subfield="false" :defaultOpen="preview" :toolbarsFlag="false" :boxShadow="false"/>
    </div>
</template>

<script>
    export default {
        name: "markdown",
        data(){
            return {
                mdData:"asdasd",
                configs: {
                    spellChecker: false,
                    autofocus: true,
                    toolbar: ['bold', 'italic', 'strikethrough', '|', 'link', 'image', {
                        name: 'custom',
                        action: (markdown) => {
                            const data = markdown.value()
                            this.$emit('save', data)
                        },
                        className: 'fa fa-save',
                        title: 'Save'
                    }],
                    markdown () {
                        // custom render
                        return render('# title')
                    },
                    inlineAttachmentOptions: {
                        onFileReceived (file) {
                            // upload to your server, get image url...
                            this.settings.setAttachmentUrl(url, this)
                        }
                    }
                }
            }
        },
        computed: {
            editor () {
                return this.$refs.Markdown.editor
            }
        }
    }
</script>

<style scoped>

</style>