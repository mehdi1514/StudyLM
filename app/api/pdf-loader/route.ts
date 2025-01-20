import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// const pdfUrl = "https://little-penguin-60.convex.cloud/api/storage/0a42f7fe-5ccd-4542-a2e9-19a9751cc6a9";

export async function GET(request: NextRequest): Promise<NextResponse> {
    // 1. load the pdf file
    const reqUrl = request.url;
    const { searchParams } = new URL(reqUrl);
    const pdfUrl = searchParams.get('pdfUrl') as string;
    const response = await fetch(pdfUrl);
    // converting pdf to blob, a format that langchain tool can understand
    const pdfBlob = await response.blob();
    const loader = new WebPDFLoader(pdfBlob);
    const docs = await loader.load();

    // 2. combine all the text from all the pages into one variable

    let pdfContent = '';
    docs.forEach(doc => {
        pdfContent += doc.pageContent;
    });

    // 3. Split the pdf content into small chunks

    // default chunkSize: 1000, default chunkOverlap: 200
    const splitter = new RecursiveCharacterTextSplitter({
        // chunkSize: 100,
        // chunkOverlap: 20,
    });
    const output = await splitter.createDocuments([pdfContent]);

    let splittedTextList: string[] = [];
    output.forEach(doc => {
        splittedTextList.push(doc.pageContent);
    });

    return NextResponse.json({ result: splittedTextList });
}