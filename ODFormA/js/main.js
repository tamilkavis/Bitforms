async function GeneratePdf( statement ) {
  // Retrieve form data 
  var dateValue = $('#m_inputdate').val();
  const [year, month, date1] = dateValue.split("-");

  var student = $('#m_username').val().trim();
  var roll = $('#m_rollno').val();
  var menname = $('#m_mentorname').val();
  var mencode = $('#m_mentorcode').val();
  var gen = $("input[name='radio1']:checked").val();
  var stay = $("input[name='radio2']:checked").val();
  var mode = $('#m_event').val();
  var event_code = $('#m_eventcode').val();
  var fromdate = $('#m_fromdate').val();
  var fromDate = formatDate(fromdate);
  var fromtime = $('#m_fromtime').val();
  var todate = formatDate($('#m_todate').val());
  var totime = $('#m_totime').val();
  var noofdays = $('#m_totaldays').val();
  var odtype = $('#m_type').val();
  details = splitString($('#details').val());
  const existingPdfUrl = '../forms/ODForm.pdf';   
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
  
  if (!dateValue || !student || !roll || !menname || !mencode || !gen || !stay || !mode || !event_code || !fromdate || !fromtime || !todate || !totime || !noofdays || !odtype) {
    alert('Please fill in all the fields.');
    return 0;
  }

  
  page.drawText(date1, { x: 492, y: 703, font: timesnewroman, size: 12 });//date
  page.drawText(month, { x: 525, y: 703, font: timesnewroman, size: 12 });//month
  page.drawText(year, { x: 548, y: 703, font: timesnewroman, size: 12 });//year
  page.drawText(student, { x: 140, y: 652, font: timesnewroman, size: 12 });//student_name
  page.drawText(menname, { x: 140, y: 684, font: timesnewroman, size: 12 });//mentor_name
  page.drawText(mencode, { x: 414, y: 683, font: timesnewroman, size: 11 });//mentor_code
  page.drawText('___________________________________________',{x:34,y:500,rotate: PDFLib.degrees(-20),font: timesnewroman, size: 25});
  page.drawText(roll, { x: 400, y: 652, font: timesnewroman, size: 12 });//register_number
  page.drawText(fromDate, { x: 86, y: 247, font: timesnewroman, size: 10 });//from_date
  page.drawText(fromtime, { x: 171, y: 247, font: timesnewroman, size: 11 });//from_time
  page.drawText(todate, { x: 291, y: 247, font: timesnewroman, size: 10 });//to_date
  page.drawText(totime, { x: 376, y: 247, font: timesnewroman, size: 11 });//to_time
  page.drawText(noofdays, { x: 526, y: 247, font: timesnewroman, size: 12 });//no_of_days
  page.drawImage(pngImage, { x: 33, y: 268, width: 15,height: 15});//onduty_tick
  gen == 0 ?  page.drawImage(pngImage, { x: 150,y: 640, width: 15,height: 15,}) : page.drawImage(pngImage, { x: 176,y: 640, width: 15,height: 15,}); 
  stay == 0 ?  page.drawImage(pngImage, {  x: 426, y: 640, width: 15,height: 15,}) :  page.drawImage(pngImage, { x: 471, y: 640, width: 15,height: 15,});
  mode == 0 ? event_type(33,585,157,590,event_code) :
  mode == 1 ? event_type(326,585,497,590,event_code) :
  mode == 2 ? event_type(33,562,210,565,event_code) :
  mode == 3 ? event_type(326,562,516,565,event_code) :
  mode == 4 ? event_type(326,537,403,540,event_code) :
  odtype == 1 ?  page.drawImage(pngImage, { x: 139, y: 229, width: 15,height: 15,}) :  page.drawImage(pngImage, { x: 99, y: 229, width: 15,height: 15,}); 
 

  page.drawText(details[0], { x: 96, y: 205, font: timesnewroman, size: 12 });//details1(max-70)
  if (typeof details[1] !== 'undefined') {
    page.drawText(details[1], { x: 96, y: 192, font: timesnewroman, size: 12 });//details2(max-70)
  } else {
    console.error('Text is undefined.');
  }
  
    // Save modified PDF document
    const modifiedPdfBytes = await pdfDoc.save();

    // Convert the PDF document to a blob
    const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

    //  Create a download link for the modified PDF and click it to download
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(modifiedPdfBlob);
    if ( statement == 'download' ){
    downloadLink.download = `OD Event Forms - ${roll}.pdf`;
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
  
function event_type(ipos_x,ipos_y,tpos_x,tpos_y,event_code){
  page.drawImage(pngImage, { x: ipos_x,y: ipos_y, width: 15,height: 15,}); // event logger
  page.drawText(event_code,{ x: tpos_x, y:tpos_y,font:timesnewroman,size:12})//event_code
  }

} 
function formatDate(dateString) {
  const dateParts = dateString.split("-");
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  return `${day}/${month}/${year}`;
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

