async function GeneratePdf( statement ) {
  var dateValue = $('#dateValue').val();
  const [year, month, date1] = dateValue.split("-");
  var student = $('#m_username').val().trim();
  var roll = $('#m_rollno').val();
  var menname = $('#m_mentorname').val();
  var mencode = $('#m_mentorcode').val();
  var gen = $("input[name='radio1']:checked").val();
  var stay = $("input[name='radio2']:checked").val();
  details = splitString($('#details').val());

  if (!dateValue || !student || !roll || !menname || !mencode || !gen || !stay ) {
    alert('Please fill in all the fields.');
    return 0;
  }

  const existingPdfUrl = '../forms/AttendanceForm.pdf';   
  const existingPdfBytes =  await fetch(existingPdfUrl).then(res => res.arrayBuffer());
  const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

  const pngUrl = '../imgs/checkmark.png'
  const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer())
  const pngImage = await pdfDoc.embedPng(pngImageBytes)
  const pngDims = pngImage.scale(0.5)

  // Set the page you want to modify
  const page = pdfDoc.getPages()[0];
  // Add text to the page
  const timesnewroman = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
  page.drawText(date1, { x: 403, y: 707, font: timesnewroman, size: 12 });//date
  page.drawText(month, { x: 434, y: 707, font: timesnewroman, size: 12 });//month
  page.drawText(year, { x: 460, y: 707, font: timesnewroman, size: 12 });//year
  page.drawText(student, { x: 160, y: 621, font: timesnewroman, size: 12 });//student_name
  page.drawText(menname, { x: 158, y: 665, font: timesnewroman, size: 12 });//mentor_name
  page.drawText(mencode, { x: 374, y: 665, font: timesnewroman, size: 12 });//mentor_code
  page.drawText('__________________________________________',{x:50,y:544,rotate:PDFLib.degrees(-14),font: timesnewroman, size: 25});
  page.drawText(roll, { x: 358, y: 621, font: timesnewroman, size: 12 });//roll_number

  page.drawText(details[0], { x: 180, y: 343, font: timesnewroman, size: 12 });//details1(max-70)
  if (typeof details[1] !== 'undefined') {
    page.drawText(details[1], { x: 180, y: 326, font: timesnewroman, size: 12 });//details2(max-70)
  }
  else{
    console.error('Text is undefined.');
  }

  page.drawImage(pngImage, { x: 46,y: 362, width: 15,height: 15,}); // attendance_tick
  gen == 0 ?   page.drawImage(pngImage, { x: 166,y: 607, width: 15,height: 15,}) : page.drawImage(pngImage, { x: 208,y: 607, width: 15,height: 15,});
  stay == 0 ?   page.drawImage(pngImage, { x: 380,y: 607, width: 15,height: 15,}) :  page.drawImage(pngImage, { x: 440,y: 607, width: 15,height: 15,});
  

    // Save modified PDF document
    const modifiedPdfBytes = await pdfDoc.save();

  // Convert the PDF document to a blob
  const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

//  Create a download link for the modified PDF and click it to download
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(modifiedPdfBlob);
if (statement == 'download') {
    downloadLink.download = `Attendance Unblock Form - ${roll}.pdf`;
    downloadLink.click();
}

  if (statement == 'print'){
    const printWindow = window.open('', '_blank');
    const printDocument = printWindow.document;
    
    // Embed the PDF in an <embed> element for printing
    const embedElement = printDocument.createElement('embed');
    embedElement.src = downloadLink.href;
    embedElement.type = 'application/pdf';
    embedElement.style.width = '100%';
    embedElement.style.height = '100vh';
    
    printDocument.body.appendChild(embedElement);
    return 1;
  }
}

function splitString(input) {
  const words = input.split(' ');
  const result = [];
  let currentLine = '';
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (currentLine.length + word.length <= 90) {
      currentLine += (currentLine.length === 0 ? '' : ' ') + word;
    } else {
      result.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine.length > 0) {
    result.push(currentLine);
  }
  return result;
}

