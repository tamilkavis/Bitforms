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
  var internship = $('#m_internship').val();
  var internship_code = $('#m_interncode').val();
  var company =$('#m_companyname').val();
  var place=$('#m_place').val();
  var todate = formatDate($('#m_todate').val());
  var fromdate = $('#m_fromdate').val();
  var fromDate = formatDate(fromdate);
  var nameof=$('#m_industryperson').val();
  var noofdays = $('#m_totaldays').val();
  var contact=$('#m_contactnumber').val();
  var odtype = $('#m_type').val();
  details = splitString($('#details').val());

  const existingPdfUrl = '../forms/ODForm.pdf';   
  const existingPdfBytes =  await fetch(existingPdfUrl).then(res => res.arrayBuffer());
  const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
  const pngUrl = '../imgs/checkmark.png'
  const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer())
  const pngImage = await pdfDoc.embedPng(pngImageBytes)
  const pngDims = pngImage.scale(0.5)
  if (!dateValue || !student || !roll || !menname || !mencode || !gen || !stay || !internship || !internship_code || !fromdate || !company || !place || !nameof || !todate || !contact || !noofdays || !odtype) {
    alert('Please fill in all the fields.');
    return 0;
  }
  // Set the page you want to modify
  const page = pdfDoc.getPages()[0];
  // Add text to the page
  const timesnewroman = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
  page.drawText(date1, { x: 492, y: 703, font: timesnewroman, size: 12 });//date
  page.drawText(month, { x: 525, y: 703, font: timesnewroman, size: 12 });//month
  page.drawText(year, { x: 548, y: 703, font: timesnewroman, size: 12 });//year
  page.drawImage(pngImage, { x: 34, y: 537, width: 15,height: 15,}); // intenship id
  page.drawImage(pngImage, { x: 33, y: 497, width: 15,height: 15,}); // intenship tick box
  page.drawText('___________________________________________',{x:32,y:277,rotate: PDFLib.degrees(-10),font: timesnewroman, size: 25});  
  page.drawText(student, { x: 140, y: 652, font: timesnewroman, size: 12 });//student_name
  page.drawText(menname, { x: 140, y: 684, font: timesnewroman, size: 12 });//mentor_name
  page.drawText(mencode, { x: 417, y: 683, font: timesnewroman, size: 12 });//mentor_code
  page.drawText(roll, { x: 405, y: 652, font: timesnewroman, size: 12 });//roll_number
  page.drawText(company, { x: 128, y: 470, font: timesnewroman, size: 12 });//company_name
  page.drawText(place, { x: 435, y: 470, font: timesnewroman, size: 12 });//place
  page.drawText(fromDate, { x: 120, y: 442, font: timesnewroman, size: 12 });//from_date
  page.drawText(todate, { x: 229, y: 442, font: timesnewroman, size: 12 });//to_date
  page.drawText(noofdays, { x: 435, y: 442, font: timesnewroman, size: 12 });//no_of_days
  page.drawText(nameof, { x: 172, y: 416, font: timesnewroman, size: 12 });//name_of_compant
  page.drawText(contact, { x: 394, y: 416, font: timesnewroman, size: 12 });//conatct_number
  page.drawText(internship_code,{ x: 175, y:540,font:timesnewroman,size:12});//intenship_code
  gen == 0 ?  page.drawImage(pngImage, { x: 150,y: 640, width: 15,height: 15,}) : page.drawImage(pngImage, { x: 176,y: 640, width: 15,height: 15,}); 
  stay == 0 ?  page.drawImage(pngImage, {  x: 426, y: 640, width: 15,height: 15,}) :  page.drawImage(pngImage, { x: 471, y: 640, width: 15,height: 15,});
  internship == 0 ? event_type(230,502) :
  internship == 1 ? event_type(330,502) :
  event_type(370,502) ; 
  page.drawText(details[0], { x: 110, y: 365, font: timesnewroman, size: 12 });//details1(max-70)
  if (typeof details[1] !== 'undefined') {
    page.drawText(details[1], { x: 110, y: 350, font: timesnewroman, size: 12 });//details2(max-70)
  } 
  if (typeof details[2] !== 'undefined'){
    page.drawText(details[2], { x: 110, y: 335, font: timesnewroman, size: 12 });//details2(max-70)
  }
  else{
    console.error('Text is undefined.');
  }
  const pdfBytes = await pdfDoc.save();
  const modifiedPdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(modifiedPdfBlob);
if ( statement == 'download') {
    downloadLink.download = `OD Internship Form - ${roll}.pdf`;
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

function event_type(ipos_x,ipos_y){
  page.drawImage(pngImage, { x: ipos_x,y: ipos_y, width: 15,height: 15,}); // event logger
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

