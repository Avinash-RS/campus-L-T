/*
kycForm
{"type":"candidate","uid":[{"target_id":"15828"}],"field_profile_image":[{"target_id":12,"alt":"Image","title":"","width":210,"height":230,"url":"/d8cintana2/sites/default/files/2020-06/filename1_1.jpg","status":"true"}],"is_default":[{"value":"1"}],"field_isformsubmitted":[{"value":false}],"field_name":{"value":"avinash"},"field_email":{"value":"avinash.candidate@mailinator.com"},"field_mobile":{"value":"2424242424"},"field_gender":{"value":"Male"},"field_mariatal_status":{"value":"Unmarried"},"field_dob":{"value":"1988-02-06T00:00:00+05:30"},"field_nationality":{"value":"Indian"},"field_aadharno":{"value":"242424242222"},"field_category":{"value":"DenotifiedTribe"},"field_address_checkbox":{"value":"1"},"field_present_line_street_addres":{"value":"No.3"},"field_present_line2_street_addre":{"value":"Trichy"},"field_present_zip":{"value":"622002"},"field_preset_city":{"value":"301"},"field_present_state":{"value":"3"},"field_permanent_line1_street_add":{"value":"No.3"},"field_permanent_line2_street_add":{"value":"Trichy"},"field_permanent_zip":{"value":"622002"},"field_permanent_city":{"value":"301"},"field_permanent_state":{"value":"3"},"langArr":[{"field_language":{"value":"English"},"field_read":[{"value":true}],"field_write":[{"value":true}],"field_speak":[{"value":true}]},{"field_language":{"value":"Tamil"},"field_read":[{"value":true}],"field_write":[{"value":true}],"field_speak":[{"value":true}]}],"field_passport_number":{"value":"24244"},"field_name_as_in_passport":{"value":"Avrrr"},"field_profesiona_as_passport":{"value":"Engineer"},"field_date_of_issue":{"value":"2021-07-21T00:00:00+05:30"},"field_valid_upto":{"value":"2021-07-15T00:00:00+05:30"},"field_place_of_issue":{"value":"Chennai"},"field_country_valid_for":{"value":"Indian"},"field_serious_illness":{"value":"Nil"},"field_no_of_days":{"value":"2"},"field_nature_of_illness":{"value":"Peros"},"field_physical_disability":{"value":"No"},"field_height":{"value":"175"},"field_weight":{"value":"73"},"field_right_eye_power_glass":{"value":"0.2"},"field_left_eyepower_glass":{"value":"1.2"},"eduArr":[{"field_level":{"value":"SSLC"},"field_board_university":{"value":"State Board"},"field_institute":{"value":"Bishop"},"field_discipline":{"value":null},"field_specification":{"value":null},"field_year_of_passing":{"value":"2021-07-22T18:07:20+05:30"},"field_backlogs":{"value":0},"field_percentage":{"value":"90"}},{"field_level":{"value":"HSC"},"field_board_university":{"value":"ICSE"},"field_institute":{"value":"Bishop"},"field_discipline":{"value":"Science"},"field_specification":{"value":"Eng"},"field_year_of_passing":{"value":"2021-07-22T18:07:39+05:30"},"field_backlogs":{"value":0},"field_percentage":{"value":"45"}},{"field_level":{"value":"UG"},"field_board_university":{"value":null},"field_institute":{"value":"A. P. Shah Institute Of Technology"},"field_discipline":{"value":"Botany"},"field_specification":{"value":"B.A."},"field_year_of_passing":{"value":"2021-02-22T18:07:53+05:30"},"field_backlogs":{"value":0},"field_percentage":{"value":"78"}}]}



localProfilePic

const data =
[
   {
    email: "Avinash@mailinator.com",
    assessments: [
      {
        name: "Aptitude Assessment",
        score: 60,
        maxScore: 100
        sections: [
          {
            name: 'Verbal',
            score: 40,
            maxScore: 40,
            percentage: 100
          },
          {
            name: 'Analytical',
            score: 40,
            maxScore: 40,
            percentage: 100
          }
        ]
      },
      {
        name: "Coding Assessment",
        score: 60,
        maxScore: 100
        sections: [
          {
            name: 'Verbal',
            score: 40,
            maxScore: 40,
            percentage: 100
          },
          {
            name: 'Analytical',
            score: 40,
            maxScore: 40,
            percentage: 100
          }
        ]
      }
    ]
   },
   {
    email: "User1@mailinator.com",
    assessments: [
      {
        name: "Aptitude Assessment",
        score: 60,
        maxScore: 100
        sections: [
          {
            name: 'Verbal',
            score: 40,
            maxScore: 40,
            percentage: 100
          },
          {
            name: 'Analytical',
            score: 40,
            maxScore: 40,
            percentage: 100
          }
        ]
      },
      {
        name: "Coding Assessment",
        score: 60,
        maxScore: 100
        sections: [
          {
            name: 'Verbal',
            score: 40,
            maxScore: 40,
            percentage: 100
          },
          {
            name: 'Analytical',
            score: 40,
            maxScore: 40,
            percentage: 100
          }
        ]
      }
    ]
   }
]

const apiData = {
shortlisted_ids: [],
shortlisted_by: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '',
emai_sent: result['type'] === 'yes' ? true : false,
shortlist_name: this.nameOfAssessment,
filter_model: ''
};
*/
