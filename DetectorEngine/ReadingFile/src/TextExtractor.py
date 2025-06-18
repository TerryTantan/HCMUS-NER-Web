def ExtractTextFromPdf(page):
    words = page.get_text("words")
    return [word[4] for word in words]

def ExtractTextFromDocx(doc):
    texts = []
    for para in doc.paragraphs:
        for run in para.runs:
            text = run.text
            if text:
                texts.append(text)
    return texts