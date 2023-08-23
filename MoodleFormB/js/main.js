var mode;
var courses = [];
var departmentData = '';
var yearData = '';
var semesterData = ''; 
var selectElement = '';
var no_of_subjects = 6;


async function GeneratePdf( statement ) {
    // Load the PDF document you want to modify
    const dateValue = $('#m_inputdate').val();
    const parts = dateValue.split("-");
    const day = parseInt(parts[2]);
    const month = parseInt(parts[1]);
    const year_ = parseInt(parts[0]);
    const datem = [day, month].join("     ");
    const date = datem + "        " + year_;
    const name = $('#m_username').val().trim().toUpperCase();
    const rollno = $('#m_rollno').val().trim();
    const department = $('#m_department').val();
    const mail = $('#m_mail').val().trim();
    const reason = $('#reason').val().trim();
    const year = $('#m_year').val();
    const no_of_subjects = $('#m_no_subjects').val();
    
    if (date === '' || name === '' || rollno === '' || department === '' || mail === '' || reason === '' || year === '') {
      alert('Fill the Form.');
      return 0;
    }
    
      var sno = ['', '', '', '', '', ''];
      var subject_code = ['', '', '', '', '', ''];
      var subject_name = ['', '', '', '', '', ''];
    if (mode)  
    for (let val = 1; val <= no_of_subjects; val++) {
        var code_name =  $(`#code_name_${val}`).val();
        [subject_code[val-1],subject_name[val-1]] = code_name.split(" - ");
        sno[val-1] = `${val}`;
    }
    else
      for (let val = 1; val <= no_of_subjects; val++) {
        subject_code[val-1] = $(`#sc${val}`).val();
        subject_name[val-1] = $(`#sname${val}`).val();
        sno[val-1] = `${val}`;
    }
  
    const existingPdfUrl = '../forms/MoodleFormB.pdf';
    const existingPdfBytes = await fetch(existingPdfUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
  
    // Set the page you want to modify
    const page = pdfDoc.getPages()[0];
  
    // Add text to the page
    const timesnewroman = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
        page.drawText(date, { x: 453, y: 659, font: timesnewroman, size: 12 });
        page.drawText(name, { x: 162, y: 623, font: timesnewroman, size: 12 });
        page.drawText(rollno, { x: 162, y: 602, font: timesnewroman, size: 12 });
        page.drawText(department, { x: 162, y: 581, font: timesnewroman, size: 12 });
        page.drawText(year, { x: 162, y: 560, font: timesnewroman, size: 12 });
        page.drawText(mail, { x: 162, y: 541, font: timesnewroman, size: 12 });
        page.drawText(reason, { x: 108, y: 441, font: timesnewroman, size: 12 });
        page.drawText('', { x: 108, y: 419, font: timesnewroman, size: 12 });
        page.drawText(sno[0], { x: 88, y: 335, font: timesnewroman, size: 12 });
        page.drawText(sno[1], { x: 88, y: 304, font: timesnewroman, size: 12 });
        page.drawText(sno[2],{ x: 88, y: 276, font: timesnewroman, size: 12 });
        page.drawText(sno[3], { x: 88, y: 249, font: timesnewroman, size: 12 });
        page.drawText(sno[4], { x: 88, y: 223, font: timesnewroman, size: 12 });
        page.drawText(sno[5], { x: 88, y: 196, font: timesnewroman, size: 12 });
        page.drawText('', { x: 88, y: 158, font: timesnewroman, size: 12 });
        page.drawText('', { x: 88, y: 130, font: timesnewroman, size: 12 });
        page.drawText(subject_code[0], { x: 151, y: 335, font: timesnewroman, size: 12 });
        page.drawText(subject_code[1], { x: 151, y: 304, font: timesnewroman, size: 12 });
        page.drawText(subject_code[2], { x: 151, y: 276, font: timesnewroman, size: 12 });
        page.drawText(subject_code[3], { x: 151, y: 249, font: timesnewroman, size: 12 });
        page.drawText(subject_code[4], { x: 151, y: 223, font: timesnewroman, size: 12 });
        page.drawText(subject_code[5], { x: 151, y: 196, font: timesnewroman, size: 12 });
        page.drawText('', { x: 151, y: 158, font: timesnewroman, size: 12 });
        page.drawText('', { x: 151, y: 130, font: timesnewroman, size: 12 });
        page.drawText(subject_name[0], { x: 250, y: 335, font: timesnewroman, size: 12 });
        page.drawText(subject_name[1], { x: 250, y: 304, font: timesnewroman, size: 12 });
        page.drawText(subject_name[2], { x: 250, y: 276, font: timesnewroman, size: 12 });
        page.drawText(subject_name[3], { x: 250, y: 249, font: timesnewroman, size: 12 });
        page.drawText(subject_name[4], { x: 250, y: 223, font: timesnewroman, size: 12 });
        page.drawText(subject_name[5], { x: 250, y: 196, font: timesnewroman, size: 12 });
        page.drawText('', { x: 250, y: 158, font: timesnewroman, size: 12 });
        page.drawText('', { x: 250, y: 130, font: timesnewroman, size: 12 });
   
  
    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();
    const modifiedPdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(modifiedPdfBlob);
    if (statement == 'download'){
      downloadLink.download = `FA Subject Unlock Form - ${rollno}.pdf`;
      downloadLink.click();
      return 1;
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


  $(document).ready(function() {
  const departmentSelect = document.getElementById('m_department');
	const yearSelect = document.getElementById('m_year');
	const semesterSelect = document.getElementById('m_semester');
	const noSubjectsSelect = document.getElementById('m_no_subjects');
	// Disable the year, semester, and noSubjects select elements initially
	yearSelect.disabled = true;
	semesterSelect.disabled = true;
	noSubjectsSelect.disabled = true;
	// Add an event listener to the department select element
	departmentSelect.addEventListener('change', () => {
    getCourseGenerateDetail();
    courses =     getCourses(departmentData, yearData, semesterData);
    console.log(courses.length);
    console.log(no_of_subjects);
    mode = courses.length > 0 ? appendDropDown(no_of_subjects, courses) : appendManualEntry(no_of_subjects) ;
    yearSelect.disabled = departmentSelect.value === '';
	yearSelect.addEventListener('change', () => {
    getCourseGenerateDetail();
    courses =     getCourses(departmentData, yearData, semesterData);
     mode = courses.length > 0 ? appendDropDown(no_of_subjects, courses) : appendManualEntry(no_of_subjects) ;
    semesterSelect.disabled = yearSelect.value === '';
		semesterSelect.addEventListener('change', () => {
      getCourseGenerateDetail();
      courses =     getCourses(departmentData, yearData, semesterData);
      mode = courses.length > 0 ? appendDropDown(no_of_subjects, courses) : appendManualEntry(no_of_subjects);
      noSubjectsSelect.disabled = yearSelect.value === '';
		noSubjectsSelect.addEventListener('change', () => {
      getCourseGenerateDetail();
      courses =     getCourses(departmentData, yearData, semesterData);
      console.log(no_of_subjects);
      mode = courses.length > 0 ? appendDropDown(no_of_subjects, courses) : appendManualEntry(no_of_subjects);
    });
      });
    });
  });

});
function getCourses(department, year, semester) {
  try {
    const departmentData = curriculum.Departments[department][year][semester];
    console.log(departmentData);
    const courses = departmentData.map(course => [`${course.code} - ${course.course}`]);
    return courses;
  } catch (TypeError) {
    courses = [];
    return courses;
  }
 
}
function getCourseGenerateDetail(){
    no_of_subjects = $('#m_no_subjects').val();
    departmentData = $('#m_department').val();
    yearData = $('#m_year').val();
    semesterData = $('#m_semester').val(); 
}
function appendDropDown(no_of_subjects,courses) {
  		$('#subjects').empty();
  			for (let num = 1; num <= no_of_subjects; num++) {
          var id_char = '#code_name_'+num.toString();
  				$('#subjects').append(`
  				<label class="form-row header" for="s_code">Subject ${num}</label>
  						<div class="form-row">
  							<select id="code_name_${num}" name="title">
                <option disabled selected class="option">Select Subject</option>`);
            for (let no = 0; no < courses.length; no++) {
              $(id_char).append(`
              <option class="option">${courses[no]}</option>
              `);
            }
  							$('#subjects').append(`</select>
  							<span class="select-btn">
  								  <i class="zmdi zmdi-chevron-down"></i>
  							</span>
  						</div>
  						
  				`);
  			}
      return 1;
}
function appendManualEntry(no_of_subjects){
  console.log(no_of_subjects);
  $('#subjects').empty();
			for (let num = 1; num <= no_of_subjects; num++) {
				$('#subjects').append(`
				<label class="form-row header" for="s_code">Subject ${num}</label>
						<div class="form-group">
							<div class="form-row form-row-1">
								<input type="text" name="s_code" id="sc${num}" class="input-text" placeholder="Subject Code" required>
							</div>
							<div class="form-row form-row-2">
								<input type="text" name="s_name" id="sname${num}" class="input-text" placeholder="Subject Name" required>
							</div>
						</div>
						
				`);
    }
return 0;
}