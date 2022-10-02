
func getBlobClient(account, container, object string) (*azblob.BlockBlobClient, error) {
    accountKey, ok := os.LookupEnv("AZURE_STORAGE_ACCOUNT_KEY")
    if !ok {
        return nil, errors.New("AZURE_STORAGE_ACCOUNT_KEY could not be found")
    }

    credential, err := azblob.NewSharedKeyCredential(account, accountKey)
    if err != nil {
        return nil, err
    }

    accountPath := fmt.Sprintf("https://%s.blob.core.windows.net/", account)
    serviceClient, err := azblob.NewServiceClientWithSharedKey(accountPath, credential, nil)
    if err != nil {
        return nil, err
    }

    containerClient, err := serviceClient.NewContainerClient(container)
    if err != nil {
        return nil, err
    }

    blobClient, err := containerClient.NewBlockBlobClient(object)
    if err != nil {
        return nil, err
    }

    return blobClient, nil
}
//---------------------------------------------------------------------------------------------------------
// https://github.com/Azure/azure-storage-blob-go/blob/d80c8c7c7c4385e4afe4ebdaab9b31efd7d87eb1/azblob/zt_examples_test.go#L1067



// Create a URL that references a to-be-created blob in your Azure Storage account's container.
// This returns a BlockBlobURL object that wraps the blob's URL and a request pipeline (inherited from containerURL)
blobURL := containerURL.NewBlockBlobURL("HelloWorld.txt") // Blob names can be mixed case

// Create the blob with string (plain text) content.
data := "Hello World!"
_, err = blobURL.Upload(ctx, strings.NewReader(data), BlobHTTPHeaders{ContentType: "text/plain"}, Metadata{}, BlobAccessConditions{}, DefaultAccessTier, nil, ClientProvidedKeyOptions{}, ImmutabilityPolicyOptions{})
if err != nil {
	log.Fatal(err)
}

// Download the blob's contents and verify that it worked correctly
get, err := blobURL.Download(ctx, 0, 0, BlobAccessConditions{}, false, ClientProvidedKeyOptions{})
if err != nil {
	log.Fatal(err)
}

downloadedData := &bytes.Buffer{}
reader := get.Body(RetryReaderOptions{})
downloadedData.ReadFrom(reader)
reader.Close() // The client must close the response body when finished with it
if data != downloadedData.String() {
	log.Fatal("downloaded data doesn't match uploaded data")
}

// List the blob(s) in our container; since a container may hold millions of blobs, this is done 1 segment at a time.
for marker := (Marker{}); marker.NotDone(); { // The parens around Marker{} are required to avoid compiler error.
	// Get a result segment starting with the blob indicated by the current Marker.
	listBlob, err := containerURL.ListBlobsFlatSegment(ctx, marker, ListBlobsSegmentOptions{})
	if err != nil {
		log.Fatal(err)
	}
	// IMPORTANT: ListBlobs returns the start of the next segment; you MUST use this to get
	// the next segment (after processing the current result segment).
	marker = listBlob.NextMarker

	// Process the blobs returned in this result segment (if the segment is empty, the loop body won't execute)
	for _, blobInfo := range listBlob.Segment.BlobItems {
		fmt.Print("Blob name: " + blobInfo.Name + "\n")
	}
}

// Delete the blob we created earlier.
_, err = blobURL.Delete(ctx, DeleteSnapshotsOptionNone, BlobAccessConditions{})
if err != nil {
	log.Fatal(err)
}

func Example_progressUploadDownload() {
	// Create a request pipeline using your Storage account's name and account key.
	accountName, accountKey := accountInfo()
	credential, err := NewSharedKeyCredential(accountName, accountKey)
	if err != nil {
		log.Fatal(err)
	}
	p := NewPipeline(credential, PipelineOptions{})

	// From the Azure portal, get your Storage account blob service URL endpoint.
	cURL, _ := url.Parse(fmt.Sprintf("https://%s.blob.core.windows.net/mycontainer", accountName))

	// Create an ServiceURL object that wraps the service URL and a request pipeline to making requests.
	containerURL := NewContainerURL(*cURL, p)

	ctx := context.Background() // This example uses a never-expiring context
	// Here's how to create a blob with HTTP headers and metadata (I'm using the same metadata that was put on the container):
	blobURL := containerURL.NewBlockBlobURL("Data.bin")

	// requestBody is the stream of data to write
	requestBody := strings.NewReader("Some text to write")

	// Wrap the request body in a RequestBodyProgress and pass a callback function for progress reporting.
	_, err = blobURL.Upload(ctx, pipeline.NewRequestBodyProgress(requestBody, func(bytesTransferred int64) {
		fmt.Printf("Wrote %d of %d bytes.", bytesTransferred, requestBody.Size())
	}), BlobHTTPHeaders{
		ContentType:        "text/html; charset=utf-8",
		ContentDisposition: "attachment",
	}, Metadata{}, BlobAccessConditions{}, DefaultAccessTier, nil, ClientProvidedKeyOptions{})
	if err != nil {
		log.Fatal(err)
	}

	// Here's how to read the blob's data with progress reporting:
	get, err := blobURL.Download(ctx, 0, 0, BlobAccessConditions{}, false, ClientProvidedKeyOptions{})
	if err != nil {
		log.Fatal(err)
	}

	// Wrap the response body in a ResponseBodyProgress and pass a callback function for progress reporting.
	responseBody := pipeline.NewResponseBodyProgress(get.Body(RetryReaderOptions{}),
		func(bytesTransferred int64) {
			fmt.Printf("Read %d of %d bytes.", bytesTransferred, get.ContentLength())
		})

	downloadedData := &bytes.Buffer{}
	downloadedData.ReadFrom(responseBody)
	responseBody.Close() // The client must close the response body when finished with it
	// The downloaded blob data is in downloadData's buffer
}