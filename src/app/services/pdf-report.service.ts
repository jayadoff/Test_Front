import { Injectable } from '@angular/core';
import pdfMake, { fonts } from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
interface CustomDocDefinition {
  content: any[];
  styles?: { [key: string]: any };
  [key: string]: any; // Allow additional properties
}
@Injectable({
  providedIn: 'root'
})
export class PdfReportService {


  constructor() {
    this.loadCustomFonts();
  }
  async loadCustomFonts() {
    const fontPath = 'assets/fonts/Kalpurush.ttf';
    const fontBase64 = await this.loadFont(fontPath);
    const robotoFontPath = 'assets/fonts/Roboto.ttf';
    const robotoFontBase64 = await this.loadFont(robotoFontPath);
    pdfMake.vfs['Kalpurush.ttf'] = fontBase64;
    pdfMake.vfs['Roboto.ttf'] = robotoFontBase64;
    (pdfMake as any).fonts = {
      ...pdfMake.fonts,
      Kalpurush: {
        normal: 'Kalpurush.ttf',
        bold: 'Kalpurush.ttf',
        italics: 'Kalpurush.ttf',
        bolditalics: 'Kalpurush.ttf'
      },
      Roboto:{
        normal: 'Roboto.ttf',
        bold: 'Roboto.ttf',
        italics: 'Roboto.ttf',
        bolditalics: 'Roboto.ttf'
      }
    };
  }

  private loadFont(url: string): Promise<string> {
    return fetch(url)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const binary = new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '');
        return btoa(binary);
      });
  }

  generateStudentReport(student: any) {

console.log('student',student);


    const documentDefinition: CustomDocDefinition = this.getDocumentDefinition(student);
    pdfMake.createPdf(documentDefinition).open();
    //pdfMake.createPdf(documentDefinition).download('Admission_Form.pdf');
  }



  getDocumentDefinition(student: any): CustomDocDefinition {

    const pageWidth = 595.28; // A4 page width in points (8.27 inches * 72 points per inch)
    const pageHeight = 841.89; // A4 page height in points (11.69 inches * 72 points per inch)
    const imageWidth = 200; // Width of the watermark image
    const imageHeight = 200; // Height of the watermark image

    const centerX = (pageWidth - imageWidth) / 2;
    const centerY = (pageHeight - imageHeight) / 2;


    return {
      content: [
         {
          // background: {
          //   image: logo,
          //   width: 200,
          //   opacity: 0.05,
          //   absolutePosition: { x: 150, y: 250 },
          // },
          columns: [
            {
              width: '13%',
              stack: [{

                image: `data:image/png;base64,${student?.DD?.BASIC_INFO?.orgImageByte}`,
                width: 60,
                height: 60,
                alignment: 'center'




              }]

            },
            {
              width: '*',
              margin: [0, -20, 0, 0],
              stack: [
                { text: `${student?.DD?.BASIC_INFO?.ORG_NAME}`, alignment: 'center',fontSize: 15,font: 'Roboto'  },
                {   text:  'EIIN: 107919, School Code: 1607, College Code: 1974, Vocational Code: 50032', bold: true, alignment: 'center',fontSize: 10,font: 'Roboto',margin: [0, 3, 0, 0], },
                {   text:  'Post Office:- Dhamrai, Upazila:- Dhamrai, District:- Dhaka, Bangladesh', bold: true, alignment: 'center',fontSize: 10,font: 'Roboto',margin: [0, 3, 0, 0], },
                
               

                {
                  columns:[

                          {
                            margin: [0, 3, 0, 0],
                            stack: [
                            {text: 'Website:  www.dhghsc.edu.bd, E-mail:  dhamraihardinge@gmail.com', color: 'blue', bold: false, alignment: 'center', fontSize: 8.5,font: 'Roboto' },
                          ]

                          },
                          // {
                          //   margin: [0, 3, 0, 0],
                          //   stack: [
                          //     // { text: 'School Code : 1607',bold: true,alignment: 'left',fontSize: 10,font: 'Roboto' }, 
                          //     // { text: 'College Code : 1974,',bold: true,alignment: 'left',fontSize: 10,font: 'Roboto'},
                          //     // { text: 'Vocational Code : 50032',bold: true,alignment: 'left',fontSize: 10,font: 'Roboto'}
                          // ]
                          // }

                  ]
                },
                {
                  text: `${student?.DD?.BASIC_INFO?.ADMISSION_TYPE === '1' ? 'HSC 1st Year Admission Form' : 
                    student?.DD?.BASIC_INFO?.ADMISSION_TYPE === '2' ? 'Honours 1st Year Admission Form' : 
                    student?.DD?.BASIC_INFO?.ADMISSION_TYPE === '3' ? 'B.B.A(Professional) 1st Year 1st Semester Admission Form' : 
                    student?.DD?.BASIC_INFO?.ADMISSION_TYPE === '4' ? 
                    `Degree ${student?.DD?.BASIC_INFO?.GROUP_NAME} 1st Year Admission Form` : 
                    student?.DD?.BASIC_INFO?.ADMISSION_TYPE === '6' ? 
                    `Masters Final ${student?.DD?.BASIC_INFO?.GROUP_NAME} Admission Form` : 
                    `${student?.DD?.BASIC_INFO?.CLASS_NAME} Admission Form`} 
                    (${student?.DD?.BASIC_INFO?.SESSION_NAME})`
             
             
             ,
             
                  bold: true,
                  alignment: 'center',
                  fontSize: 10,
                  font: 'Roboto',
                  margin: [0, 1, 0, 0],
                },
                
               // {   text: `HSC 1st Year Admission From (${student?.DD?.BASIC_INFO?.SESSION_NAME})`,bold: true,alignment: 'center',fontSize: 10,font: 'Roboto' ,margin: [0, 1, 0, 0],},
                {   text: student?.DD?.BASIC_INFO?.SHIFT_NAME  ,bold: true,alignment: 'center',margin: [0, 1, 0, 0],fontSize: 10,font: 'Roboto'},
              ]
            },
            {
              width: '13%',
              stack: [{

              }]

            },
          ],
          columnGap: 10, // Adjust gap between columns
          marginBottom: 10 // Adjust margin as needed
        },

        {
          columns: [
            {
              width: '*',
              stack: [
                {
                  columns: [
                    {
                      width: '*',
                      stack: [
                        {
                          columns: [
                            { text: 'Form No', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label
                            { text: `: ${student?.DD?.BASIC_INFO?.FORM_NO}`, width: 200, margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: 'Class Name', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label
                            { text: `: ${student?.DD?.BASIC_INFO?.CLASS_NAME}`, width: 200, margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: 'Admission Roll', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label
                            { text: `: ${student?.DD?.BASIC_INFO?.ADMISSION_ROLL}`, width: 200, margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },

                        {
                          columns: [
                            { text: 'Group ', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label
                            { text: `: ${student?.DD?.BASIC_INFO?.GROUP_NAME}`, width: 200, margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: 'Session', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label
                            { text: `: ${student?.DD?.BASIC_INFO?.SESSION_NAME}`, width: 200, margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        // {
                        //   columns: [
                        //     { text: 'Student Code', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label
                        //     { text: `: ${student?.DD?.BASIC_INFO?.STUDENT_CODE}`, width: 200, margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                        //   ]
                        // },
                        {
                          columns: [
                            { text: 'Student Name', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label
                            { text: `: ${student?.DD?.BASIC_INFO?.STUDENT_NAME}`, width: 200, margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        }
                      ]


                    },


                    {
                      width: 90,
                      image: `data:image/png;base64,${student?.DD?.BASIC_INFO?.ImageByte}`,
                      height: 90,
                      alignment: 'center'
                    }
                  ]
                },

              ]
            },

          ],
          columnGap: 10, // Adjust gap between columns
        },


        {
          columns: [
            {
              width: '*',
              stack: [
                {
                  columns: [
                    {
                      width: '*',
                      stack: [
                        {
                          columns: [
                            { text: 'Sms Mobile Number', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.SMS_MOBILE_NUM}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: 'Admission Date', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.ADMISSION_DATE}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: 'Date of Birth', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.DATE_OF_BIRTH}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: 'Birth Certificate No', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.BIRTH_REG_NUM ? student.DD.BASIC_INFO.BIRTH_REG_NUM : ''}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: 'Gender', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.GENDER_NAME}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: 'Religion', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.RELIGION_NAME}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: 'Nationality', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.NATIONALITY_NAME}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: 'Blood Group', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.BLOOD_GROUP_NAME}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: 'Present Address', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.PRESENT_ADDR}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: 'Permanent Address', width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.PERMANENT_ADDR}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        }
                      ],


                    },
                  ]
                },

              ]
            },

          ],
          columnGap: 10, // Adjust gap between columns
          marginBottom: 10 // Adjust margin as needed
        },


        {
          columns: [
            {
              width: '*',
              stack: [
                {
                  columns: [
                    {
                      width: '50%',
                      stack: [
                        {
                          columns: [
                            { text: `Father's Name`, width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.FATHERS_NAME}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: `Contact Number`, width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.FATHER_CONTACT_NO}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: `Father's Occupation`, width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.FATHER_OCCUPATION_NAME}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: `Father's NID Number`, width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.FATHERS_NID ? student.DD.BASIC_INFO.FATHERS_NID : ''}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: `Parent's Monthly Income    : ${student?.DD?.BASIC_INFO?.PARENTS_MON_INCOME}`,style: 'value', width: '*', margin: [0, 3, 0, 0]}, // Label with colon
                           // { text: `${student?.DD?.BASIC_INFO?.PARENTS_MON_INCOME}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        }
                      ]

                    },


                    {
                      width: '50%',
                      stack: [
                        {
                          columns: [
                            { text: `Mother's Name`, width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.MOTHERS_NAME}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: `Contact Number`, width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.MOTHER_CONTACT_NO}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: `Mother's Occupation`, width: 111, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.MOTHER_OCCUPATION_NAME}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                        {
                          columns: [
                            { text: `Mother's NID Number`, width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.MOTHERS_NID ? student.DD.BASIC_INFO.MOTHERS_NID : ''}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        },
                      ]

                    },
                  ]
                },

              ]
            },

          ],
          columnGap: 10, // Adjust gap between columns
          marginBottom: 10 // Adjust margin as needed
        },

        {
          columns: [
            {
              width: '*',
              stack: [
                {
                  columns: [
                    {
                      width: '50%',
                      stack: [
                        {
                          columns: [
                            { text: `Guardian's Name`, width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.GUARDIAN_NAME}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        }


                      ]

                    },


                    {
                      width: '50%',
                      stack: [
                        {
                          columns: [
                            { text: `Guardian Number`, width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                            { text: `: ${student?.DD?.BASIC_INFO?.GUARDIAN_NUMBER}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                          ]
                        }

                      ]

                    },
                  ]
                },

              ]
            },

          ],
          columnGap: 10, // Adjust gap between columns
        //  marginBottom: 10 // Adjust margin as needed
        },

        {
          columns: [
            {
              width: '*',
              stack: [
                {
                  columns: [
                    { text: `Guardian's Address`, width: 110, margin: [0, 3, 0, 0], style: 'label' }, // Label with colon
                    { text: `: ${student?.DD?.BASIC_INFO?.GUARDIAN_ADDRESS}`, width: '*', margin: [0, 3, 0, 0], style: 'value' } // Value with left margin
                  ]
                }

              ]
            },

          ],
          columnGap: 10, // Adjust gap between columns
        //  marginBottom: 10 // Adjust margin as needed
        },


        // {
        //   width: '*',
        //   stack: [
        //     { text: 'Previous Education Information:', marginTop: 20 ,marginBottom:5,style: 'value',
        //       italics:true },
        //     this.getEducationTable(student.DD.EDUCATION_INFO)
        //   ]
        // },

        {
          width: '*',
          stack: [
              {
                text: student?.DD?.EDUCATION_INFO?.length > 0 ? 'Previous Education Information:' : '',
                  marginTop: 20,
                  marginBottom: 5,
                  style: 'value',
                  italics: true
              },
              student.DD.EDUCATION_INFO ? this.getEducationTable(student.DD.EDUCATION_INFO) : []
          ]
      },
      
        {
          text: student?.DD?.SUBJECT_INFO?.length > 0 ? 'Subject to Acceptance:' : '',
          marginTop: 15 ,
          italics:true// Adjust margin as needed
        },
        
        this.getSubjectsList(student.DD.SUBJECT_INFO,student),


          { text: `* I, the undersigned, hereby declare that the information provided in the admission form is completely true. If any information is found to be false, the admission will be considered cancelled. I also undertake to attend classes regularly, participate in exams, pay the college dues on time, and abide by all the rules and regulations. I accept that I shall be bound by any decisions made by the college authorities.`, margin: [0, 10, 0, 0],style: 'bottomText' },

      ],






      footer: {
        columns: [
            {
              width: '100%',
              alignment: 'center',
              stack: [
                  {
                    columns: [
                      {
                          width: '25%',
                          alignment: 'center',
                          stack: [
                              { text: '-------------------------------- ', alignment: 'center' , style: 'SignContent' },
                              { text: 'Sign Of Student ', alignment: 'center' ,style: 'SignContent'  },

                          ]
                      },

                      {
                          width: '25%',
                          alignment: 'center',
                          stack: [
                            { text: '-------------------------------- ', alignment: 'center' ,style: 'SignContent'  },
                              { text: 'Sign Of Guardian', alignment: 'center',style: 'SignContent' },

                          ]
                      },
                      {
                        width: '25%',
                        alignment: 'center',
                        stack: [
                            { text: '-------------------------------- ', alignment: 'center' ,style: 'SignContent'  },
                            { text: 'Sign Of Office ', alignment: 'center' , style: 'SignContent' },

                        ]
                    },

                    {
                        width: '25%',
                        alignment: 'center',
                        stack: [
                          { text: '-------------------------------- ', alignment: 'center' ,style: 'SignContent'  },
                            { text: 'Sign Of Principal', alignment: 'center',style: 'SignContent' },

                        ]
                    }
                  ]
                   },
              ],
             },


        ]
    },

      styles: {

        header: {
          fontSize: 20,
          bold: true,
          alignment:'center',
          margin: [0, 0, 0, 0]
        },
        subheader: {
          fontSize: 16,
          alignment:'center',
          margin: [0, 0, 0, 5],

        },
        label: {
          fontSize: 10,
          bold: true,
           alignment: 'left',
           font: 'Roboto'
        },
        value: {
          fontSize: 10,
           alignment: 'left',
            font: 'Roboto'
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'black'
        },
        tableContent: {
          bold: false,
          fontSize: 9,
          color: 'black'
        },
        SignContent: {
          bold: false,
          fontSize: 8,
          color: 'black'
        },
        bottomText:{
          fontSize: 11,
          italics: true,
          alignment: 'justify'
        }
      },






     // watermark: { text: 'WATERMARK', color: 'blue', opacity: 0.3, bold: true, italics: false }

     background: {
      image: `data:image/png;base64,${student?.DD?.BASIC_INFO?.orgImageByte}`,
      width: imageWidth,
      height: imageHeight,
      opacity: 0.1,
      absolutePosition: { x: centerX, y: centerY }
    }
    };

  }

  getEducationTable(previousEducation: any[]) {


    return {
      table: {
        widths: ['10%','*','15%','15%','12%','10%','8%',],
        body: [
          [
            { text: 'Exam', style: 'tableHeader' },
            { text: 'Institute Name', style: 'tableHeader' },
            { text: 'Roll No', style: 'tableHeader' },
            { text: 'Reg No', style: 'tableHeader' },
            { text: 'Board', style: 'tableHeader' },
            { text: 'Year', style: 'tableHeader' },
            { text: 'GPA', style: 'tableHeader' },
          ],
         // ...previousEducation.map(ed => [ed?.EXAM_NAME, ed?.INSTITUTE, ed?.ROLL_NO,ed?.REG_NO,ed?.BOARD,ed?.PASSING_YEAR,ed?.RESULT])
         ...previousEducation.map(ed => [
          { text: ed?.EXAM_NAME, style: 'tableContent' },
          { text: ed?.INSTITUTE, style: 'tableContent' },
          { text: ed?.ROLL_NO, style: 'tableContent' },
          { text: ed?.REG_NO, style: 'tableContent' },
          { text: ed?.BOARD, style: 'tableContent' },
          { text: ed?.PASSING_YEAR, style: 'tableContent' },
          { text: ed?.RESULT, style: 'tableContent' }
        ])
        ]
      },
      layout: {
        hLineWidth: (i: number, node: any) => 1,
        vLineWidth: (i: number, node: any) => 1,
        hLineColor: (i: number, node: any) => '#ddd',
        vLineColor: (i: number, node: any) => '#ddd',
        paddingLeft: (i: number, node: any) => 4,
        paddingRight: (i: number, node: any) => 4,
        paddingTop: (i: number, node: any) => 2,
        paddingBottom: (i: number, node: any) => 2
      }
    };
  }


  // getSubjectsList(subjects: any[]) {
  //   console.log('subjects',subjects);

  //   subjects.sort((a, b) => a.SUBJECT_CODE - b.SUBJECT_CODE);
  //   const subjectNames = subjects.map(subject => subject?.SUBJECT_NAME || '');

  //   const numColumns = 3;
  //   const subjectsPerColumn = Math.ceil(subjectNames.length / numColumns);

  //   const columns = [];
  //   for (let i = 0; i < numColumns; i++) {
  //       const columnSubjects = subjectNames.slice(i * subjectsPerColumn, (i + 1) * subjectsPerColumn);
  //       columns.push({
  //           ul: columnSubjects.map(subject => ({
  //               text: subject,
  //               font: 'Kalpurush'
  //           }))
  //       });
  //   }

  //   const formattedColumns = columns.map(column => ({
  //       stack: column.ul.map(item => ({ ul: [item] })) // Wrap each item in ul to create bullet points
  //   }));

  //   return {
  //       columns: formattedColumns,
  //       margin: [0, 5] // Adjust margins as needed
  //   };
  // }
//   getSubjectsList(subjects: any[]) {
//     console.log('subjects', subjects);

//     subjects.sort((a, b) => a.SUBJECT_CODE - b.SUBJECT_CODE);
//     const subjectNames = subjects.map(subject => subject?.SUBJECT_NAME || '');

//     const numColumns = 3;
//     const subjectsPerColumn = Math.ceil(subjectNames.length / numColumns);
//     console.log('subjectsPerColumn',subjectsPerColumn);
//     const columns = [];
//     for (let i = 0; i < numColumns; i++) {
//         const columnSubjects = subjects.slice(i * subjectsPerColumn, (i + 1) * subjectsPerColumn);
//         console.log('columnSubjects',columnSubjects);

//         columns.push({
//             ul: columnSubjects.map((subject, index) => {
//                 let text = subject;
//                 if (subjects.?IS_COMP === 'N' && (i * subjectsPerColumn + index + 1) === 4) {
//                     text += ' (4th Subject)';
//                 }
//                 return {
//                     text: text,
//                     font: 'Kalpurush'
//                 };
//             })
//         });
//     }

//     const formattedColumns = columns.map(column => ({
//         stack: column.ul.map(item => ({ ul: [item] })) // Wrap each item in ul to create bullet points
//     }));

//     return {
//         columns: formattedColumns,
//         margin: [0, 5] // Adjust margins as needed
//     };
// }



// getSubjectsList(subjects: any[]) {
//  // console.log('subjects', subjects);

//   //subjects.sort((a, b) => a.SUBJECT_CODE - b.SUBJECT_CODE);
//   subjects.sort((a, b) => {
//     if (a.IS_COMP === b.IS_COMP) {
//       // If both subjects are of the same type, sort by SUBJECT_CODE
//       return a.SUBJECT_CODE - b.SUBJECT_CODE;
//     }
//     // Optional subjects should come after required subjects
//     return a.IS_COMP === 'N' ? 1 : -1;
//   });
//   const numColumns = 3;
//   const subjectsPerColumn = Math.ceil(subjects.length / numColumns);
//  // console.log('subjectsPerColumn',subjectsPerColumn);
//   const columns = [];
//   for (let i = 0; i < numColumns; i++) {
//       const columnSubjects = subjects.slice(i * subjectsPerColumn, (i + 1) * subjectsPerColumn);
//      // console.log('columnSubjects',columnSubjects);

//       columns.push({
//           ul: columnSubjects.map((subject, index) => {
//            // console.log('subject',subject);
//               let text = subject.SUBJECT_NAME;
//               if (subject.IS_COMP === 'N' ) {
//                   text += ' (Optional)';

//               }

//               return {
//                   text: text,
//                   font: 'Kalpurush'
//               };
//           })
//       });
//   }

//   const formattedColumns = columns.map(column => ({
//       stack: column.ul.map(item => ({ ul: [item] })) // Wrap each item in ul to create bullet points
//   }));

//   return {
//       columns: formattedColumns,
//       margin: [0, 5] // Adjust margins as needed
//   };
// }
getSubjectsList(subjects: any[],student:any) {
  // Check if subjects is not null, undefined, or an empty array
  if (!subjects || subjects.length === 0) {
    console.warn('No subjects information found.');
    return {
      text: '',  // You can customize this return if needed
      font: 'Kalpurush',
      margin: [0, 5] // Adjust margins as needed
    };
  }

  // Proceed if subjects list exists

  if( student?.DD?.BASIC_INFO?.ADMISSION_TYPE === '4'){

    subjects.sort((a: { SUBJECT_ID: number; }, b: { SUBJECT_ID: number; }) => a.SUBJECT_ID - b.SUBJECT_ID);
  }else{

    subjects.sort((a, b) => {
      if (a.IS_COMP === b.IS_COMP) {
        // If both subjects are of the same type, sort by SUBJECT_CODE
        return a.SUBJECT_CODE - b.SUBJECT_CODE;
      }
  
  
      // Optional subjects should come after required subjects
      return a.IS_COMP === 'N' ? 1 : -1;
    });
  }
  

  const numColumns = 3;
  const subjectsPerColumn = Math.ceil(subjects.length / numColumns);
  const columns = [];

  for (let i = 0; i < numColumns; i++) {
    const columnSubjects = subjects.slice(i * subjectsPerColumn, (i + 1) * subjectsPerColumn);

    columns.push({
      ul: columnSubjects.map((subject, index) => {
        let text = subject.SUBJECT_NAME;
        if (subject.IS_COMP === 'N') {
          text += ' (Optional)';
        }

        return {
          text: text,
          font: 'Kalpurush'
        };
      })
    });
  }

  const formattedColumns = columns.map(column => ({
    stack: column.ul.map(item => ({ ul: [item] })) // Wrap each item in ul to create bullet points
  }));

  return {
    columns: formattedColumns,
    margin: [0, 5] // Adjust margins as needed
  };
}


  private getBase64Image(imageUrl: string): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageUrl;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx!.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpg');
  }
}
