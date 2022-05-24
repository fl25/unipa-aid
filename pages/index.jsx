import React, { useRef, useState } from 'react'
import * as XLSX from 'xlsx/xlsx.mjs';

import { AppBar, Button, Box, Card, CardContent, IconButton, Toolbar, Container, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Component = () => {
  const fileInput = useRef(null)
  const [fileName, setFileName] = useState('')
  const [excelData, setExcelData] = useState('')

  const handleTriggerReadFile = () => {
    if (fileInput.current) {
      fileInput.current.click()
    }
  }
  const handleReadFile = (fileObj) => {
    if (fileObj) {
      setFileName(fileObj.name)
      fileObj.arrayBuffer().then((buffer) => {
        const workbook = XLSX.read(buffer, { type: 'buffer', bookVBA: true })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const data = XLSX.utils.sheet_to_json(worksheet)
        setExcelData(JSON.stringify(data))
      })
    }
  }
  return (
    <Box sx={{ width: '60%', margin: 'auto', }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          UNIPA-aid
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 2, paddingBottom: '20px' }}>Excelファイルをアップロードする</Container>
      <Grid container spacing={2}>
        <Grid item xs={3}>
            <Button variant="contained" onClick={() => handleTriggerReadFile()}>ファイル選択</Button>
        </Grid>
        <Grid item xs={9}>
          {!!fileName && <Container>ファイル名：{fileName}</Container>}
        </Grid>
      </Grid>
      <form style={{ display: 'none' }}>
        <input
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ref={fileInput}
          onChange={(e) => {
            e.preventDefault()
            handleReadFile(e.currentTarget.files[0])
          }}
        />
      </form>
      {!!excelData && (
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            {excelData}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
export default Component