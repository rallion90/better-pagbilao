export type FormsSource = {
  name: string
  url: string
  accessed: string
}

export type TransparencyDocument = {
  title: string
  category: string
  url: string
}

export type DownloadableFormItem = {
  title: string
  type?: string
  url: string
}

export type DownloadableFormSection = {
  section: string
  note?: string
  items: DownloadableFormItem[]
}

export type FormsAndDocumentsData = {
  source: FormsSource
  transparency: TransparencyDocument[]
  downloadableForms: DownloadableFormSection[]
}
