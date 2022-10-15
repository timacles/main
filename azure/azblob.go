// https://gist.github.com/schmichael/7379338
// Piping file into gzip


// AWS upload example
func (t *Table) Upload() {
  year := time.Now().Format("2006")
  month := time.Now().Format("01")
  day := time.Now().Format("02")
  reader, writer := io.Pipe()
  go func() {
    gw := gzip.NewWriter(writer)
    io.Copy(gw, t.File)
    t.File.Close()
    gw.Close()
    writer.Close()
  }()
  uploader := s3manager.NewUploader(session.New(&aws.Config{Region: aws.String(os.Getenv("AWS_REGION"))}))
  result, err := uploader.Upload(&s3manager.UploadInput{
    Body:   reader,
    Bucket: aws.String(os.Getenv("S3_BUCKET")),
    Key:    aws.String(fmt.Sprintf("%s/%s/%s/%s/%s", os.Getenv("S3_KEY"), year, month, day, t.Name+".csv.gz")),
  })
  if err != nil {
    log.WithField("error", err).Fatal("Failed to upload file.")
  }
  log.WithField("location", result.Location).Info("Successfully uploaded to")
}
