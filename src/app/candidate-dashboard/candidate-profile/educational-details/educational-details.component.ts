import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, NgForm } from '@angular/forms';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import moment from 'moment';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { FormCanDeactivate } from 'src/app/guards/form-canDeactivate/form-can-deactivate';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
// import { NzSelectSizeType } from 'ng-zorro-antd/select';
@Component({
  selector: 'app-educational-details',
  templateUrl: './educational-details.component.html',
  styleUrls: ['./educational-details.component.scss']
})
export class EducationalDetailsComponent extends FormCanDeactivate implements OnInit, OnDestroy {
  @ViewChild('form', { static: false })
  form: NgForm;
  form1: NgForm;
  form2: NgForm;
  form3: NgForm;
  form4: NgForm;
  form5: NgForm;

  level = [
    {
      name: 'SSLC',
      value: 'sslc'
    },
    {
      name: 'HSC',
      value: 'hsc'
    },
    {
      name: 'Diplamo',
      value: 'diplamo'
    },
    {
      name: 'Under Graduation',
      value: 'ug'
    },
    {
      name: 'Post Graduation',
      value: 'pg'
    },
    {
      name: 'Other',
      value: 'other'
    }
  ];

  institutes = [
    { name: "Indian Institute of Engineering Science And Technology, Shibpur", value: "Indian Institute of Engineering Science And Technology, Shibpur" },
    { name: "Punjab Engineering College", value: "Punjab Engineering College" },
    { name: "Jadavpur University", value: "Jadavpur University" },
    { name: "College of Engineering, Pune", value: "College of Engineering, Pune" },
    { name: "Veermata Jijabai Technological Institute, Mumbai", value: "Veermata Jijabai Technological Institute, Mumbai" },
    { name: "Cochin University of Science and Technology", value: "Cochin University of Science and Technology" },
    { name: "Jamia Millia Islamia, Delhi", value: "Jamia Millia Islamia, Delhi" },
    { name: "Sardar Patel College of Engineering, Mumbai", value: "Sardar Patel College of Engineering, Mumbai" },
    { name: "Birsa Institute of Technology, Sindri ", value: "Birsa Institute of Technology, Sindri " },
    { name: "Jawaharlal Nehru Technological University, Kakinada", value: "Jawaharlal Nehru Technological University, Kakinada" },
    { name: "Veer Surendra Sai University of Technology, Burla", value: "Veer Surendra Sai University of Technology, Burla" },
    { name: "Andhra University College of Engineering", value: "Andhra University College of Engineering" },
    { name: "Delhi Technological University", value: "Delhi Technological University" },
    { name: "College Of Engineering, Guindy - Anna University", value: "College Of Engineering, Guindy - Anna University" },
    { name: "PSG College of Technology, Coimbatore", value: "PSG College of Technology, Coimbatore" },
    { name: "Jabalpur Engg College", value: "Jabalpur Engg College" },
    { name: "Harcourt Butler Technical University", value: "Harcourt Butler Technical University" },
    { name: "Osmania University", value: "Osmania University" },
    { name: "Thiagarajar College of Engineering, Madurai", value: "Thiagarajar College of Engineering, Madurai " },
    { name: "Indian Institute of Technology, Patna", value: "Indian Institute of Technology, Patna" },
    { name: "Indian Institute of Technology, Tirupati", value: "Indian Institute of Technology, Tirupati" },
    { name: "Indian Institute of Technology, Mandi", value: "Indian Institute of Technology, Mandi" },
    { name: "Indian Institute of Technology, Gandhinagar", value: "Indian Institute of Technology, Gandhinagar" },
    { name: "Indian Institute of Technology, Bhubaneswar", value: "Indian Institute of Technology, Bhubaneswar" },
    { name: "Indian Institute of Technology, Indore", value: "Indian Institute of Technology, Indore" },
    { name: "Indian Institute of Technology, Palakkad", value: "Indian Institute of Technology, Palakkad" },
    { name: "Indian Institute of Technology, Jodhpur", value: "Indian Institute of Technology, Jodhpur" },
    { name: "Indian Institute of Technology, Ropar", value: "Indian Institute of Technology, Ropar" },
    { name: "Indian Institute of Technology, Bhilai", value: "Indian Institute of Technology, Bhilai" },
    { name: "Indian Institute of Technology, Goa", value: "Indian Institute of Technology, Goa" },
    { name: "Indian Institute of Technology, Jammu", value: "Indian Institute of Technology, Jammu" },
    { name: "Indian Institute of Technology, Dharwad", value: "Indian Institute of Technology, Dharwad" },
    { name: "National Institute of Technology, Durgapur", value: "National Institute of Technology, Durgapur" },
    { name: "National Institute of Technology, Delhi", value: "National Institute of Technology, Delhi" },
    { name: "National Institute of Technology, Trichy", value: "National Institute of Technology, Trichy" },
    { name: "Dr. B. R. Ambedkar National Institute of Technology, Jalandhar", value: "Dr. B. R. Ambedkar National Institute of Technology, Jalandhar" },
    { name: "National Institute of Technology, Jamshedpur", value: "National Institute of Technology, Jamshedpur" },
    { name: "National Institute of Technology, Agartala", value: "National Institute of Technology, Agartala" },
    { name: "National Institute of Technology, Warangal", value: "National Institute of Technology, Warangal" },
    { name: "National Institute of Technology, Rourkela", value: "National Institute of Technology, Rourkela" },
    { name: "Maulana Azad National Institute of Technology, Bhopal", value: "Maulana Azad National Institute of Technology, Bhopal" },
    { name: "National Institute of Technology, Tadepalligudem, Andhra Pradesh", value: "National Institute of Technology, Tadepalligudem, Andhra Pradesh" },
    { name: "Malaviya National Institute of Technology, Jaipur", value: "Malaviya National Institute of Technology, Jaipur" },
    { name: "National Institute of Technology, Kurukshetra", value: "National Institute of Technology, Kurukshetra" },
    { name: "National Institute of Technology, Silchar", value: "National Institute of Technology, Silchar" },
    { name: "National Institute of Technology Mizoram", value: "National Institute of Technology Mizoram" },
    { name: "National Institute of Technology, Meghalaya", value: "National Institute of Technology, Meghalaya" },
    { name: "National Institute of Technology, Manipur", value: "National Institute of Technology, Manipur" },
    { name: "National Institute of Technology, Goa", value: "National Institute of Technology, Goa" },
    { name: "National Institute of Technology Karnataka, Surathkal", value: "National Institute of Technology Karnataka, Surathkal" },
    { name: "Visvesvaraya National Institute of Technology, Nagpur", value: "Visvesvaraya National Institute of Technology, Nagpur" },
    { name: "National Institute of Technology, Patna", value: "National Institute of Technology, Patna" },
    { name: "S V National Institute of Technology, Surat", value: "S V National Institute of Technology, Surat" },
    { name: "National Institute of Technology Uttarakhand", value: "National Institute of Technology Uttarakhand" },
    { name: "National Institute of Technology, Srinagar", value: "National Institute of Technology, Srinagar" },
    { name: "National Institute of Technology, Raipur", value: "National Institute of Technology, Raipur" },
    { name: "National Institute of Technology Sikkim", value: "National Institute of Technology Sikkim" },
    { name: "National Institute of Technology, Arunachal Pradesh", value: "National Institute of Technology, Arunachal Pradesh" },
    { name: "National Institute of Technology, Nagaland", value: "National Institute of Technology, Nagaland" },
    { name: "Motilal Nehru National Institute of Technology, Allahabad", value: "Motilal Nehru National Institute of Technology, Allahabad" },
    { name: "National Institute of Technology, Calicut", value: "National Institute of Technology, Calicut" },
    { name: "National Institute of Technology, Hamirpur", value: "National Institute of Technology, Hamirpur" },
    { name: "National Institute of Technology, Karaikal", value: "National Institute of Technology, Karaikal" },
    { name: "Birla Institute of Technology and Science, Pilani – Goa", value: "Birla Institute of Technology and Science, Pilani – Goa" },
    { name: "Birla Institute of Technology & Science, Pilani - Hyderabad", value: "Birla Institute of Technology & Science, Pilani - Hyderabad" },
    { name: "Birla Institute of Technology and Science, Pilani", value: "Birla Institute of Technology and Science, Pilani" },
    { name: "Manipal Insitute of Technology", value: "Manipal Insitute of Technology" },
    { name: "Thapar Institute of Engineering and Technology", value: "Thapar Institute of Engineering and Technology" },
    { name: "Pondicherry Engg College", value: "Pondicherry Engg College" },
    { name: "Birla Institute of Technology, Mesra", value: "Birla Institute of Technology, Mesra" },
    { name: "Vellore Institute of Technology", value: "Vellore Institute of Technology" },
    { name: "SRM Institute of Science and Technology", value: "SRM Institute of Science and Technology" },
    { name: "Sri Sivasubramaniya Nadar (SSN) College of Engineering", value: "Sri Sivasubramaniya Nadar (SSN) College of Engineering" },
    { name: "Amrita Vishwa Vidyapeetham University", value: "Amrita Vishwa Vidyapeetham University" },
    { name: "Coimbatore Institute of Technology", value: "Coimbatore Institute of Technology" },
    { name: "National Institute of Engineering, Mysore", value: "National Institute of Engineering, Mysore" },
    { name: "Sastra University", value: "Sastra University" },
    { name: "Walchand College of Engineering, Sangli", value: "Walchand College of Engineering, Sangli" },
    { name: "Sri Jayachamarajendra College of Engineering", value: "Sri Jayachamarajendra College of Engineering" },
    { name: "Birla Vishvakarma Mahavidyalaya Engineering College", value: "Birla Vishvakarma Mahavidyalaya Engineering College" },
    { name: "University of Petroleum and Energy Studies (only for Civil & Safety)", value: "University of Petroleum and Energy Studies (only for Civil & Safety)" },
    { name: "Rashtreeya Vidyalaya College of Engineering", value: "Rashtreeya Vidyalaya College of Engineering" },
    { name: "Ramaiah Institute of Technology", value: "Ramaiah Institute of Technology" },
    { name: "B.M.S. College of Engineering", value: "B.M.S. College of Engineering" },
    { name: "Siddaganga Institute of Technology, Tumkur", value: "Siddaganga Institute of Technology, Tumkur" },
    { name: "Bangalore Institute of Technology", value: "Bangalore Institute of Technology" },
    { name: "Shiv Nadar University", value: "Shiv Nadar University" },
    { name: "GMR Institute of Technology, Rajam", value: "GMR Institute of Technology, Rajam" },
    { name: "Mahindra Ecole Centrale", value: "Mahindra Ecole Centrale" },
    { name: "National Institute of Design", value: "National Institute of Design" },
    { name: "Indian Statistical Institute", value: "Indian Statistical Institute" },
    { name: "MIT, Pune", value: "MIT, Pune" },
    { name: "Pearl Academy", value: "Pearl Academy" },
    { name: "NMIMS", value: "NMIMS" },
    { name: "Mumbai University", value: "Mumbai University" },
    { name: "ISDI, Mumbai", value: "ISDI, Mumbai" },
    { name: "Welingkar", value: "Welingkar" },
    { name: "Sri Vidyanikethan Engineering College, Tirupati", value: "Sri Vidyanikethan Engineering College, Tirupati" },
    { name: "Siddharth Institute of Engineering and Technology, Puttur   ", value: "Siddharth Institute of Engineering and Technology, Puttur   " },
    { name: "Sri Venkateswara College of Engineering & Technology, Chittoor", value: "Sri Venkateswara College of Engineering & Technology, Chittoor" },
    { name: "VEMU Institute of Technology, Chittoor", value: "VEMU Institute of Technology, Chittoor" },
    { name: "MITS, Madanapalle", value: "MITS, Madanapalle" },
    { name: "IIDT - Tirupati", value: "IIDT - Tirupati" },
    { name: "Aditya Group of Educational Institutions", value: "Aditya Group of Educational Institutions" },
    { name: "Pandit Deendayal Petroleum University", value: "Pandit Deendayal Petroleum University" },
    { name: "Vignan University", value: "Vignan University" },
    { name: "Koneru Lakshmaiah College of Engineering", value: "Koneru Lakshmaiah College of Engineering" },
    { name: "Godavari Institute of Engineering and Technology", value: "Godavari Institute of Engineering and Technology" },
    { name: "SPIT, Mumbai", value: "SPIT, Mumbai" },
    { name: "Shri Ramdeobaba College Of Engineering And Management", value: "Shri Ramdeobaba College Of Engineering And Management" },
    { name: "DJ Sanghvi, Mumbai", value: "DJ Sanghvi, Mumbai" },
    { name: "PICT, Pune", value: "PICT, Pune" },
    { name: "VIT, Pune", value: "VIT, Pune" },
    { name: "Thadomal Shahani Engineering College", value: "Thadomal Shahani Engineering College" },
    { name: "Fr Agnel, Bandra", value: "Fr Agnel, Bandra" },
    { name: "Vivekanand , Mumbai", value: "Vivekanand , Mumbai" },
    { name: "Maharshi Karve Stree Shikshan Samstha's Cummins College Of Engineering For Women", value: "Maharshi Karve Stree Shikshan Samstha's Cummins College Of Engineering For Women" },
    { name: "Fr. Agnels, Vashi", value: "Fr. Agnels, Vashi" },
    { name: "Zagdu Singh Charitable Trust's, Thakur College Of Engineering & Technology", value: "Zagdu Singh Charitable Trust's, Thakur College Of Engineering & Technology" },
    { name: "Vishwakarma Institute of Information Technology VIIT Pune", value: "Vishwakarma Institute of Information Technology VIIT Pune " },
    { name: "Government College Of Engineering, Amravati", value: "Government College Of Engineering, Amravati" },
    { name: "Pune Vidhyarthi Griha's College Of Engineering And Technology", value: "Pune Vidhyarthi Griha's College Of Engineering And Technology" },
    { name: "Shah And Anchor , Mumbai", value: "Shah And Anchor , Mumbai" },
    { name: "The Bombay Salesian Society's Don Bosco Institute Of Technology (DBIT), Kurla", value: "The Bombay Salesian Society's Don Bosco Institute Of Technology (DBIT), Kurla" },
    { name: "Shri Guru Gobind Singhji Institute Of Engineering & Technology", value: "Shri Guru Gobind Singhji Institute Of Engineering & Technology" },
    { name: "Vidyalankar Institute of Technology", value: "Vidyalankar Institute of Technology" },
    { name: "Pimpri Chinchwad Education Trust's Pimpri Chinchwad College Of Engineering", value: "Pimpri Chinchwad Education Trust's Pimpri Chinchwad College Of Engineering" },
    { name: "St. Francis Institute of Technology", value: "St. Francis Institute of Technology" },
    { name: "Ramrao Adik Institute of Technology, Nerul", value: "Ramrao Adik Institute of Technology, Nerul" },
    { name: "Manjara Charitable Trust's, Rajiv Gandhi Institute Of Technology, Versova", value: "Manjara Charitable Trust's, Rajiv Gandhi Institute Of Technology, Versova" },
    { name: "Government College of Engineering, Karad", value: "Government College of Engineering, Karad" },
    { name: "South Indian Education Society's Graduate School of Technology, Navi Mumbai", value: "South Indian Education Society's Graduate School of Technology, Navi Mumbai" },
    { name: "M.H. Saboo Siddik College Of Engineering, Byculla", value: "M.H. Saboo Siddik College Of Engineering, Byculla" },
    { name: "Vidyavardhini College Of Engineering And Technology", value: "Vidyavardhini College Of Engineering And Technology" },
    { name: "Atharva College of Engineering (ACE), Malad, Mumbai", value: "Atharva College of Engineering (ACE), Malad, Mumbai" },
    { name: "Karmveer Kakasaheb Wagh Institute of Engineering Education & Research (K. K. Wagh)", value: "Karmveer Kakasaheb Wagh Institute of Engineering Education & Research (K. K. Wagh)" },
    { name: "K. E. Society's Rajarambapu Institute of Technology, Walwa, Sangli", value: "K. E. Society's Rajarambapu Institute of Technology, Walwa, Sangli" },
    { name: "Xavier Institute of Engineering, Mahim", value: "Xavier Institute of Engineering, Mahim" },
    { name: "Yeshwantrao Chavan College Of Engineering", value: "Yeshwantrao Chavan College Of Engineering" },
    { name: "Dattajirao Kadam Technology Education Society's Textile & Engineering Institute, Ichalkaranji", value: "Dattajirao Kadam Technology Education Society's Textile & Engineering Institute, Ichalkaranji" },
    { name: "Dattajirao Kadam Technical Education Society's Textile & Engineering Institute, Ichalkaranji", value: "Dattajirao Kadam Technical Education Society's Textile & Engineering Institute, Ichalkaranji" },
    { name: "Kolhapur Institute of Technology College of Engineering, Kolhapu", value: "Kolhapur Institute of Technology College of Engineering, Kolhapu" },
    { name: "International Institute Of Information Technology, Pune (i2IT)", value: "International Institute Of Information Technology, Pune (i2IT)" },
    { name: "G.H. Raisoni Group", value: "G.H. Raisoni Group" },
    { name: "Ankush Shikshan Sanstha's G.H.Raisoni College of Engineering, Nagpur", value: "Ankush Shikshan Sanstha's G.H.Raisoni College of Engineering, Nagpur" },
    { name: "Datta Meghe College of Engineering, Navi Mumbai", value: "Datta Meghe College of Engineering, Navi Mumbai" },
    { name: " N.Y.S.S.'s Datta Meghe College of Engineering, Airoli, Navi Mumbai", value: " N.Y.S.S.'s Datta Meghe College of Engineering, Airoli, Navi Mumbai" },
    { name: "Watumull Institute of Electronics Engineering & Computer Technology", value: "Watumull Institute of Electronics Engineering & Computer Technology" },
    { name: "Progressive Education Society's Modern College Of Engineering", value: "Progressive Education Society's Modern College Of Engineering" },
    { name: "Government College Of Engineering, Jalgaon", value: "Government College Of Engineering, Jalgaon" },
    { name: "Rizvi College of Engineering", value: "Rizvi College of Engineering" },
    { name: "Shree L.R. Tiwari College of Engineering, Mira Road, Mumbai", value: "Shree L.R. Tiwari College of Engineering, Mira Road, Mumbai" },
    { name: "All India Shri Shivaji Memorial Society's College of Engineering, Pune", value: "All India Shri Shivaji Memorial Society's College of Engineering, Pune" },
    { name: "Bharati Vidyapeeth's College Of Engineering, Mumbai", value: "Bharati Vidyapeeth's College Of Engineering, Mumbai" },
    { name: "Pillai Institute of Information Technology, Engineering, Media Studies and Research, New Panvel", value: "Pillai Institute of Information Technology, Engineering, Media Studies and Research, New Panvel" },
    { name: "Dr. Babasaheb Ambedkar Technological University, Lonere", value: "Dr. Babasaheb Ambedkar Technological University, Lonere" },
    { name: "Shri Sant Gajanan Maharaj College of Engineering,Shegaon", value: "Shri Sant Gajanan Maharaj College of Engineering,Shegaon " },
    { name: "Walchand Institute of Technology, Solapur", value: "Walchand Institute of Technology, Solapur" },
    { name: "Dr. D. Y. Patil Pratishthan's D.Y.Patil College of Engineering Akurdi, Pune", value: "Dr. D. Y. Patil Pratishthan's D.Y.Patil College of Engineering Akurdi, Pune" },
    { name: "All India Shri Shivaji Memorial Society's Institute of Information Technology,Pune", value: "All India Shri Shivaji Memorial Society's Institute of Information Technology,Pune" },
    { name: "Terna Public Charitable Trust's, Terna Engineering College", value: "Terna Public Charitable Trust's, Terna Engineering College" },
    { name: "Modern Education Society's Group of Colleges", value: "Modern Education Society's Group of Colleges" },
    { name: "Modern Education Society's College of Engineering, Pune", value: "Modern Education Society's College of Engineering, Pune" },
    { name: "Padmabhushan Vasantdada Patil Pratishthan's College of Engineering", value: "Padmabhushan Vasantdada Patil Pratishthan's College of Engineering" },
    { name: "A. P. Shah Institute Of Technology", value: "A. P. Shah Institute Of Technology" },
    { name: "Marathwada Mitra Mandal's Group", value: "Marathwada Mitra Mandal's Group" },
    { name: "Mahatma Gandhi Mission Group", value: "Mahatma Gandhi Mission Group" },
    { name: "Lokmanya Tilak Jankalyan Shikshan Sanstha's Lokmanya Tilak College Of Engineering", value: "Lokmanya Tilak Jankalyan Shikshan Sanstha's Lokmanya Tilak College Of Engineering" },
    { name: "Bharati Vidyapeeth's College of Engineering for Women, Katraj, Dhankawadi, Pune", value: "Bharati Vidyapeeth's College of Engineering for Women, Katraj, Dhankawadi, Pune" },
    { name: "Pad. Dr.D.Y.Patil Institute of Engineering, Management & Reseach, Akurdi, Pune", value: "Pad. Dr.D.Y.Patil Institute of Engineering, Management & Reseach, Akurdi, Pune" },
    { name: "St. Vincent Pallotti College of Engineering & Technology, Nagpur", value: "St. Vincent Pallotti College of Engineering & Technology, Nagpur" },
    { name: "Excelsior Education Society's K.C. College Of Engineering", value: "Excelsior Education Society's K.C. College Of Engineering" },
    { name: "Nashik District Maratha Vidya Prasarak Samaj's Karmaveer Adv.Babaurao Ganpatrao Thakare College of Engineering, Nashik", value: "Nashik District Maratha Vidya Prasarak Samaj's Karmaveer Adv.Babaurao Ganpatrao Thakare College of Engineering, Nashik" },
    { name: "Dr. D.Y. Patil Vidya Pratishthan Society's, Dr. D.Y. Patil Institute of Engineering & Technology, Pimpri", value: "Dr. D.Y. Patil Vidya Pratishthan Society's, Dr. D.Y. Patil Institute of Engineering & Technology, Pimpri" },
    { name: "New Horizon Institute of Technology & Management, Thane", value: "New Horizon Institute of Technology & Management, Thane" },
    { name: "Late Shri. Vishnu Waman Thakur Charitable Trust, Viva Institute of Technology, Shirgaon", value: "Late Shri. Vishnu Waman Thakur Charitable Trust, Viva Institute of Technology, Shirgaon" },
    { name: "Sanjivani Rural Education Society's Sanjivani College of Engineering, Kopargaon", value: "Sanjivani Rural Education Society's Sanjivani College of Engineering, Kopargaon" },
    { name: "Sanjivani Rural Education Society's Sanjivani College of Engineering, Kopargaon", value: "Sanjivani Rural Education Society's Sanjivani College of Engineering, Kopargaon" },
    { name: "Dr. D. Y. Patil School OF Engineering, Lohegaon, Pune", value: "Dr. D. Y. Patil School OF Engineering, Lohegaon, Pune" },
    { name: "Annasaheb Dange College of Engineering and Technology, Ashta, Sangli", value: "Annasaheb Dange College of Engineering and Technology, Ashta, Sangli " },
    { name: "Jawahar Education Society's Annasaheb Chudaman Patil College Of Engineering", value: "Jawahar Education Society's Annasaheb Chudaman Patil College Of Engineering" },
    { name: "Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering & Technology, Baramati Dist.Pune", value: "Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering & Technology, Baramati Dist.Pune " },
    { name: "Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering & Technology, Baramati Dist.Pune", value: "Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering & Technology, Baramati Dist.Pune" },
    { name: "Aldel Education Trust's St. John College of Engineering & Management, Vevoor, Palghar", value: "Aldel Education Trust's St. John College of Engineering & Management, Vevoor, Palghar" },
    { name: "Prof. Ram Meghe Institute of Technology & Research, Amravati", value: "Prof. Ram Meghe Institute of Technology & Research, Amravati " },
    { name: "Amrutvahini College Of Engineering, Sangamner", value: "Amrutvahini College Of Engineering, Sangamner" },
    { name: "Saraswati Education Society's Saraswati College of Engineering,Kharghar Navi Mumbai", value: "Saraswati Education Society's Saraswati College of Engineering,Kharghar Navi Mumbai" },
    { name: "Smt. Indira Gandhi College of Engineering, Navi Mumbai", value: "Smt. Indira Gandhi College of Engineering, Navi Mumbai" },
    { name: "Universal College of Engineering,Kaman Dist. Thane", value: "Universal College of Engineering,Kaman Dist. Thane" },
    { name: "M.G.M.'s College of Engineering and Technology, Kamothe, Navi Mumbai", value: "M.G.M.'s College of Engineering and Technology, Kamothe, Navi Mumbai" },
    { name: "JSPM Narhe Technical Campus, Pune", value: "JSPM Narhe Technical Campus, Pune" },
    { name: "Dr. J. J. Magdum Charitable Trust's Dr. J.J. Magdum College of Engineering, Jaysingpur", value: "Dr. J. J. Magdum Charitable Trust's Dr. J.J. Magdum College of Engineering, Jaysingpur " },
    { name: "Sou. Sushila Danchand Ghodawat Cha.Trust's Sanjay Ghodavat Group of Institution (Integrated Campus), Atigre, Kolhapur", value: "Sou. Sushila Danchand Ghodawat Cha.Trust's Sanjay Ghodavat Group of Institution (Integrated Campus), Atigre, Kolhapur" },
    { name: "Sir Shantilal Badjate Charitable Trust's S. B. Jain Institute of technology, Management & Research, Nagpur", value: "Sir Shantilal Badjate Charitable Trust's S. B. Jain Institute of technology, Management & Research, Nagpur " },
    { name: "Pradnya Niketan Education Society's Nagesh Karajagi Orchid College of Engineering & Technology, Solapur", value: "Pradnya Niketan Education Society's Nagesh Karajagi Orchid College of Engineering & Technology, Solapur" },
    { name: "MET Bhujbal Knowledge City MET League's Engineering College, Adgaon, Nashik", value: "MET Bhujbal Knowledge City MET League's Engineering College, Adgaon, Nashik" },
    { name: "Bharati Vidyapeeth's College of Engineering,Lavale, Pune", value: "Bharati Vidyapeeth's College of Engineering,Lavale, Pune " },
    { name: "Shivajirao S. Jondhale College of Engineering, Dombivali,Mumbai", value: "Shivajirao S. Jondhale College of Engineering, Dombivali,Mumbai" },
    { name: "Zeal Education Society's Zeal College of Engineering & Reserch, Narhe, Pune", value: "Zeal Education Society's Zeal College of Engineering & Reserch, Narhe, Pune " },
    { name: "Samridhi Sarwajanik Charitable Trust, Jhulelal Institute of Technology, Nagpur", value: "Samridhi Sarwajanik Charitable Trust, Jhulelal Institute of Technology, Nagpur" },
    { name: "Gokhale Education Society's, R.H. Sapat College of Engineering, Management Studies and Research, Nashik", value: "Gokhale Education Society's, R.H. Sapat College of Engineering, Management Studies and Research, Nashik" },
    { name: "Sandip Foundation, Sandip Institute of Technology and Research Centre, Mahiravani, Nashik", value: "Sandip Foundation, Sandip Institute of Technology and Research Centre, Mahiravani, Nashik" },
    { name: "Anjuman-I-Islam's Kalsekar Technical Campus", value: "Anjuman-I-Islam's Kalsekar Technical Campus" },
    { name: "Nutan Maharashtra Institute of Engineering and Technology", value: "Nutan Maharashtra Institute of Engineering and Technology" },
    { name: "Mahatma Education Society's Pillai HOC College of Engineering & Technology, Tal. Khalapur. Dist. Raigad", value: "Mahatma Education Society's Pillai HOC College of Engineering & Technology, Tal. Khalapur. Dist. Raigad" },
    { name: "Sipna Shikshan Prasarak Mandal College of Engineering & Technology, Amravati", value: "Sipna Shikshan Prasarak Mandal College of Engineering & Technology, Amravati " },
    { name: "Department of Technology, Shivaji University, Kolhapur", value: "Department of Technology, Shivaji University, Kolhapur" },
    { name: "Indira College of Engineering & Management, Pune", value: "Indira College of Engineering & Management, Pune" },
    { name: "Mauli Group of Institutions, College of Engineering and Technology, Shegaon", value: "Mauli Group of Institutions, College of Engineering and Technology, Shegaon" },
    { name: "Shri Vithal Education and Research Institute's College of Engineering, Pandharpur", value: "Shri Vithal Education and Research Institute's College of Engineering, Pandharpur" },
    { name: "Dr. D. Y. Patil School of Engineering & Technology, Charholi(Bk), Via Lohgaon, Pune", value: "Dr. D. Y. Patil School of Engineering & Technology, Charholi(Bk), Via Lohgaon, Pune" },
    { name: "Rajiv Gandhi College of Engineering & Research, Hingna Road, Nagpur", value: "Rajiv Gandhi College of Engineering & Research, Hingna Road, Nagpur" },
    { name: "P. R. Pote (Patil) Education & Welfare Trust's Group of Institution(Integrated Campus), Amravati", value: "P. R. Pote (Patil) Education & Welfare Trust's Group of Institution(Integrated Campus), Amravati " },
    { name: "Marathwada Mitra Mandal's Institute of Technology, Lohgaon, Pune", value: "Marathwada Mitra Mandal's Institute of Technology, Lohgaon, Pune" },
    { name: "Cummins College of Engineering For Women, Sukhali (Gupchup), Tal. Hingna Hingna Nagpur", value: "Cummins College of Engineering For Women, Sukhali (Gupchup), Tal. Hingna Hingna Nagpur" },
    { name: "Lokmanya Tilak Jankalyan Shikshan Sanstha, Priyadarshani College of Engineering, Nagpur", value: "Lokmanya Tilak Jankalyan Shikshan Sanstha, Priyadarshani College of Engineering, Nagpur" },
    { name: "Gharda Foundation's Gharda Institute of Technology,Khed, Ratnagiri", value: "Gharda Foundation's Gharda Institute of Technology,Khed, Ratnagiri" },
    { name: "Shetkari Shikshan Mandal's Pad. Vasantraodada Patil Institute of Technology, Budhgaon, Sangli", value: "Shetkari Shikshan Mandal's Pad. Vasantraodada Patil Institute of Technology, Budhgaon, Sangli " },
    { name: "SNJB's Late Sau. Kantabai Bhavarlalji Jain College of Engineering, (Jain Gurukul), Neminagar,Chandwad,(Nashik)", value: "SNJB's Late Sau. Kantabai Bhavarlalji Jain College of Engineering, (Jain Gurukul), Neminagar,Chandwad,(Nashik)" },
    { name: "G.H. Raisoni Academy of Engineering & Technology, Nagpur", value: "G.H. Raisoni Academy of Engineering & Technology, Nagpur" },
    { name: "Hope Foundation and research center's Finolex Academy of Management and Technology, Ratnagiri", value: "Hope Foundation and research center's Finolex Academy of Management and Technology, Ratnagiri" },
    { name: "S.S.P.M.'s College of Engineering, Kankavli", value: "S.S.P.M.'s College of Engineering, Kankavli " },
    { name: "S.S.P.M.'s College of Engineering, Kankavli", value: "S.S.P.M.'s College of Engineering, Kankavli" },
    { name: "S. B. Patil College Of Engineering", value: "S. B. Patil College Of Engineering" },
    { name: "Institute of Knowledge College Of Engineering", value: "Institute of Knowledge College Of Engineering" },
    { name: "Government College Of Technology, Coimbatore", value: "Government College Of Technology, Coimbatore" },
    { name: "SVCOE, Chennai", value: "SVCOE, Chennai" },
    { name: "Kumaraguru College Of Technology", value: "Kumaraguru College Of Technology" },
    { name: "Government College Of Engineering, Salem", value: "Government College Of Engineering, Salem" },
    { name: "R.M.K. COLLEGE OF ENGINEERING AND TECHNOLOGY (Group)", value: "R.M.K. COLLEGE OF ENGINEERING AND TECHNOLOGY (Group)" },
    { name: "SRI KRISHNA COLLEGE OF ENGINEERING & TECHNOLOGY", value: "SRI KRISHNA COLLEGE OF ENGINEERING & TECHNOLOGY " },
    { name: "Meenakshi Sundararajan Engineering College", value: "Meenakshi Sundararajan Engineering College" },
    { name: "SRM Easwari Engineering College", value: "SRM Easwari Engineering College" },
    { name: "Mepco Schlenk Engineering College", value: "Mepco Schlenk Engineering College" },
    { name: "Loyola-ICAM College of Engineering and Technology", value: "Loyola-ICAM College of Engineering and Technology" },
    { name: "Kongu Engineering College", value: "Kongu Engineering College" },
    { name: "Panimalar Engineering College, Chennai", value: "Panimalar Engineering College, Chennai" },
    { name: "Sri Ramakrishna Engineering College", value: "Sri Ramakrishna Engineering College" },
    { name: "Bannari Amman Institute of Technology, Erode", value: "Bannari Amman Institute of Technology, Erode" },
    { name: "VELAMMAL ENGINEERING COLLEGE", value: "VELAMMAL ENGINEERING COLLEGE" },
    { name: "RAJALAKSHMI ENGINEERING COLLEGE", value: "RAJALAKSHMI ENGINEERING COLLEGE" },
    { name: "JEPPIAAR ENGINEERING COLLEGE", value: "JEPPIAAR ENGINEERING COLLEGE" },
    { name: "Dr.Mahalingam College Of Engineering And Technology", value: "Dr.Mahalingam College Of Engineering And Technology" },
    { name: "Sri Sai Ram Group of Colleges", value: "Sri Sai Ram Group of Colleges" },
    { name: "SRI KRISHNA COLLEGE OF TECHNOLOGY", value: "SRI KRISHNA COLLEGE OF TECHNOLOGY" },
    { name: "VLB Group of Institutions", value: "VLB Group of Institutions" },
    { name: "Government College of Engineering, Bargur", value: "Government College of Engineering, Bargur" },
    { name: "Valliammai Engineering College", value: "Valliammai Engineering College" },
    { name: "Sona College Of Technology", value: "Sona College Of Technology" },
    { name: "Karpagam Group of Colleges", value: "Karpagam Group of Colleges" },
    { name: "Prince Shri Venkateshwara Padmawathy Engineering College ", value: "Prince Shri Venkateshwara Padmawathy Engineering College  " },
    { name: " JEPPIAAR INSTITUTE OF TECHNOLOGY", value: " JEPPIAAR INSTITUTE OF TECHNOLOGY" },
    { name: " RAJALAKSHMI INSTITUTE OF TECHNOLOGY", value: " RAJALAKSHMI INSTITUTE OF TECHNOLOGY" },
    { name: "Sri Shakthi Institutions Group", value: "Sri Shakthi Institutions Group" },
    { name: "Saveetha Engineering College", value: "Saveetha Engineering College" },
    { name: "KPR Institute Of Engineering And Technology", value: "KPR Institute Of Engineering And Technology" },
    { name: "Misrimal Navajee Munoth Jain Engineering College", value: "Misrimal Navajee Munoth Jain Engineering College" },
    { name: "KCG College of Technology", value: "KCG College of Technology" },
    { name: "VTMT Dr R Rangarajan Dr R Sakunthala Engineering College, Avadi", value: "VTMT Dr R Rangarajan Dr R Sakunthala Engineering College, Avadi" },
    { name: "Sri Ramakrishna Institute Of Technology", value: "Sri Ramakrishna Institute Of Technology" },
    { name: "Meenakshi College Of Engineering", value: "Meenakshi College Of Engineering" },
    { name: "VSB College of Engineering Technical Campus", value: "VSB College of Engineering Technical Campus" },
    { name: "Sri Eshwar College Of Engineering", value: "Sri Eshwar College Of Engineering" },
    { name: "JEPPIAAR SRR ENGINEERING COLLEGE", value: "JEPPIAAR SRR ENGINEERING COLLEGE" },
    { name: "SVS College Of Engineering", value: "SVS College Of Engineering" },
    { name: "Annamalai University", value: "Annamalai University" },
    { name: "Dr.N.G.P. Institute of Technology", value: "Dr.N.G.P. Institute of Technology" },
    { name: "Veltech Multi Tech Dr Rangarajan Dr Sakunthala Engineering College, Chennai", value: "Veltech Multi Tech Dr Rangarajan Dr Sakunthala Engineering College, Chennai" },
    { name: "Jerusalem College of Engineering", value: "Jerusalem College of Engineering" },
    { name: "SriGuru Institute of Technology", value: "SriGuru Institute of Technology" },
    { name: "HINDUSTHAN COLLEGE OF ENGINEERING AND TECHNOLOGY", value: "HINDUSTHAN COLLEGE OF ENGINEERING AND TECHNOLOGY" },
    { name: "PA Engineering College", value: "PA Engineering College " },
    { name: "S.A.Engineering College", value: "S.A.Engineering College" },
    { name: "Agni College of Technology", value: "Agni College of Technology" },
    { name: "Adhiyamaan College of Engineering", value: "Adhiyamaan College of Engineering" },
    { name: "SNS Institutions Group", value: "SNS Institutions Group" },
    { name: "JEPPIAAR MAAMALLAN ENGINEERING COLLEGE", value: "JEPPIAAR MAAMALLAN ENGINEERING COLLEGE" },
    { name: "KANCHEEPURAM", value: "KANCHEEPURAM" },
    { name: "Park College of Engineering", value: "Park College of Engineering" },
    { name: "Park College of Engineering And Technology", value: "Park College of Engineering And Technology" },
    { name: "KGiSL Institute of Technology", value: "KGiSL Institute of Technology" },
    { name: "Adhiparasakthi Engineering College, Melmaruvathur", value: "Adhiparasakthi Engineering College, Melmaruvathur" },
    { name: "Kalaignar Karunanidhi Institute Of Technology", value: "Kalaignar Karunanidhi Institute Of Technology" },
    { name: "Akshaya College Of Engineering And Technology", value: "Akshaya College Of Engineering And Technology" },
    { name: "HINDUSTHAN INSTITUTE OF TECHNOLOGY", value: "HINDUSTHAN INSTITUTE OF TECHNOLOGY" },
    { name: "Jaya Engineering College", value: "Jaya Engineering College" },
    { name: "Anand Institute Of Higher Technology", value: "Anand Institute Of Higher Technology" },
    { name: "Nehru Institute of Engineering and Technology", value: "Nehru Institute of Engineering and Technology" },
    { name: "Coimbatore Institute Of Engineering And Technology", value: "Coimbatore Institute Of Engineering And Technology" },
    { name: "Sasurie Group of Colleges", value: "Sasurie Group of Colleges" },
    { name: "Krishnasamy College of Engineering and Technology", value: "Krishnasamy College of Engineering and Technology" },
    { name: "RVS College of Engineering & Technology", value: "RVS College of Engineering & Technology" },
    { name: "Dhanalakshmi College of Engineering", value: "Dhanalakshmi College of Engineering" },
    { name: "Tagore Engineering College", value: "Tagore Engineering College" },
    { name: "New Prince Shri Bhavani College Of Engg & Tech", value: "New Prince Shri Bhavani College Of Engg & Tech" },
    { name: "United Institute Of Technology", value: "United Institute Of Technology" },
    { name: "DMI College of Engineering", value: "DMI College of Engineering" },
    { name: "PPG Institute of Technology", value: "PPG Institute of Technology" },
    { name: "GKM College of Engineering and Technology", value: "GKM College of Engineering and Technology" },
    { name: "Pallavan College of Engineering", value: "Pallavan College of Engineering" },
    { name: "Sree Sastha Institute of Engineering and Technology", value: "Sree Sastha Institute of Engineering and Technology" },
    { name: "Karpaga Vinayaga Educational Group", value: "Karpaga Vinayaga Educational Group" },
    { name: "Sri Muthukumaran Institute of Technology", value: "Sri Muthukumaran Institute of Technology" },
    { name: "Maharaja Engineering College", value: "Maharaja Engineering College" },
    { name: "Srinivasa Institute of Engineering and Technology", value: "Srinivasa Institute of Engineering and Technology" },
    { name: "Adithya Institute of Technology, Coimbatore", value: "Adithya Institute of Technology, Coimbatore" },
    { name: "Thangavelu Engineering College", value: "Thangavelu Engineering College" },
    { name: "University Visveswariah College Of Engineering (UVCE)", value: "University Visveswariah College Of Engineering (UVCE)" },
    { name: "National Institute of Engineering, Institute Of Technology, Mysore", value: "National Institute of Engineering, Institute Of Technology, Mysore" },
    { name: "BMSCE, Bangalore", value: "BMSCE, Bangalore" },
    { name: "Dayananda Sagar College of Engineering", value: "Dayananda Sagar College of Engineering" },
    { name: "Sir Mokshagundam Visvesvaraya Institute of Technology (MVIT)", value: "Sir Mokshagundam Visvesvaraya Institute of Technology (MVIT)" },
    { name: "RNS Institute Of Technology, Bangalore (RNSIT)", value: "RNS Institute Of Technology, Bangalore (RNSIT)" },
    { name: "B.N.M Institute Of Technology (BNMIT)", value: "B.N.M Institute Of Technology (BNMIT)" },
    { name: "PESIT, Bangalore ", value: "PESIT, Bangalore  " },
    { name: "Nitte Meenakshi Institute of Technology, Bangalore", value: "Nitte Meenakshi Institute of Technology, Bangalore" },
    { name: "Dr. Ambedkar Institute Of Technology", value: "Dr. Ambedkar Institute Of Technology" },
    { name: "JSS Academy Of Technical Education, Bangalore", value: "JSS Academy Of Technical Education, Bangalore" },
    { name: "CMRIT College of Engineering, Bangalore", value: "CMRIT College of Engineering, Bangalore" },
    { name: "Karnatak Law Society’s Gogte Institute of Technology, Belagavi", value: "Karnatak Law Society’s Gogte Institute of Technology, Belagavi" },
    { name: "New Horizon College Of Engineering (NHCE)", value: "New Horizon College Of Engineering (NHCE)" },
    { name: "St. Joseph Engineering College", value: "St. Joseph Engineering College" },
    { name: "Acharya Institute Of Technology", value: "Acharya Institute Of Technology" },
    { name: "Vidya Vardhaka College of Engineering Mysuru", value: "Vidya Vardhaka College of Engineering Mysuru" },
    { name: "SJB Institute of Technology", value: "SJB Institute of Technology" },
    { name: "Sahyadri College Of Engineering & Management, Mangalore", value: "Sahyadri College Of Engineering & Management, Mangalore" },
    { name: "KLE Dr M. S. Sheshagiri College of Engineering, Belgaum", value: "KLE Dr M. S. Sheshagiri College of Engineering, Belgaum" },
    { name: "Bapuji Institute Of Engineering & Technology", value: "Bapuji Institute Of Engineering & Technology" },
    { name: "Global Academy Of Technology (GAT)", value: "Global Academy Of Technology (GAT)" },
    { name: "PES College of Engineering, Mandya", value: "PES College of Engineering, Mandya" },
    { name: "MVJ College Of Engineering", value: "MVJ College Of Engineering" },
    { name: "Saptagiri College Of Engineering (SCE)", value: "Saptagiri College Of Engineering (SCE)" },
    { name: "Reva Institute Of  Technology & Management", value: "Reva Institute Of  Technology & Management" },
    { name: "Poojya Dodappa Appa College of Engineering", value: "Poojya Dodappa Appa College of Engineering" },
    { name: "Kammavari Sangham Institute Of Technology (KSIT)", value: "Kammavari Sangham Institute Of Technology (KSIT)" },
    { name: "SJC Institute Of Technology, Chickaballapur", value: "SJC Institute Of Technology, Chickaballapur" },
    { name: "Cambridge Institute Of Technology", value: "Cambridge Institute Of Technology" },
    { name: "Mangalore Institute Of Technology & Engineering, Mangalore", value: "Mangalore Institute Of Technology & Engineering, Mangalore" },
    { name: "Sai Vidya Institute Of Technology", value: "Sai Vidya Institute Of Technology" },
    { name: "GSSS Institute Of Engineering & Technology For Women, Mysore", value: "GSSS Institute Of Engineering & Technology For Women, Mysore" },
    { name: "Sri Siddhartha Institute of Technology", value: "Sri Siddhartha Institute of Technology" },
    { name: "Oxford College Of Engineering", value: "Oxford College Of Engineering" },
    { name: "Don Bosco Institute of Technology, Bangalore", value: "Don Bosco Institute of Technology, Bangalore" },
    { name: "Atria Institute Of Technology", value: "Atria Institute Of Technology" },
    { name: "Canara Engineering College, Mangalore", value: "Canara Engineering College, Mangalore" },
    { name: "Sri Venkateswara College Of Engineering", value: "Sri Venkateswara College Of Engineering" },
    { name: "Channabasaveshwara Institute of Technology (CIT, Tumkur)", value: "Channabasaveshwara Institute of Technology (CIT, Tumkur)" },
    { name: "Vemana Institute Of Technology", value: "Vemana Institute Of Technology" },
    { name: "Vidya Vikas Institute Of Engineering & Technology, Mysore", value: "Vidya Vikas Institute Of Engineering & Technology, Mysore" },
    { name: "RajaRajeswari College of Engineering", value: "RajaRajeswari College of Engineering" },
    { name: "Nagarjuna College of Engineering & Technology", value: "Nagarjuna College of Engineering & Technology" },
    { name: "AMC Engineering College", value: "AMC Engineering College" },
    { name: "East West Institute Of Technology", value: "East West Institute Of Technology" },
    { name: "Shri Dharmasthala Manjunatheshwara College of engineering & Technology (SDM)", value: "Shri Dharmasthala Manjunatheshwara College of engineering & Technology (SDM)" },
    { name: "APS College Of Engineering", value: "APS College Of Engineering" },
    { name: "HKBK College Of Engineering", value: "HKBK College Of Engineering" },
    { name: "Alva`s Institute Of Engineering And Technology, Moodbidri", value: "Alva`s Institute Of Engineering And Technology, Moodbidri" },
    { name: "Hirasugar Institute of Technology", value: "Hirasugar Institute of Technology" },
    { name: "P. A. College Of Engineering, Mangalore", value: "P. A. College Of Engineering, Mangalore" },
    { name: "Vivekananda College Of Engineering And Technology, Puttur", value: "Vivekananda College Of Engineering And Technology, Puttur" },
    { name: "Alpha College Of Engineering", value: "Alpha College Of Engineering" },
    { name: "Coorg Institute Of Technology, Ponnampet", value: "Coorg Institute Of Technology, Ponnampet" },
    { name: "KVG College of Engineering", value: "KVG College of Engineering" },
    { name: "R L Jalappa Institute of Technology, Bangalore", value: "R L Jalappa Institute of Technology, Bangalore" },
    { name: "Maharaja Institute Of Technology, Mysore", value: "Maharaja Institute Of Technology, Mysore" },
    { name: "Sambhram Institute Of Technology", value: "Sambhram Institute Of Technology" },
    { name: "Rajiv Gandhi Institute Of Technology", value: "Rajiv Gandhi Institute Of Technology" },
    { name: "East Point College Of Engineering And Technology", value: "East Point College Of Engineering And Technology" },
    { name: "Sri Krishna Institute Of Technology", value: "Sri Krishna Institute Of Technology" },
    { name: "City Engineering College", value: "City Engineering College" },
    { name: "Angadi Institute of Technology and Management", value: "Angadi Institute of Technology and Management" },
    { name: "BTL Institute of Technology", value: "BTL Institute of Technology" },
    { name: "Jnana Vikas Institute Of Technology", value: "Jnana Vikas Institute Of Technology" },
    { name: "Shree Devi Group of Institutions", value: "Shree Devi Group of Institutions" },
    { name: "Brindavan College Of Engineering", value: "Brindavan College Of Engineering" },
    { name: "Shirdi Sai Engineering College, Bangalore", value: "Shirdi Sai Engineering College, Bangalore" },
    { name: "Sri Taralabalu Jagadguru Institute of Technology", value: "Sri Taralabalu Jagadguru Institute of Technology" },
    { name: "Rajeev Institute of Technology", value: "Rajeev Institute of Technology" },
    { name: "Dr. T Thimaiah Institute Of Technology", value: "Dr. T Thimaiah Institute Of Technology" },
    { name: "Bheemanna Khandre Institute of Technology( Formerly REC), Karnataka", value: "Bheemanna Khandre Institute of Technology( Formerly REC), Karnataka" },
    { name: "JNTUH", value: "JNTUH" },
    { name: "IIIT Hyderabad", value: "IIIT Hyderabad" },
    { name: "Chaitanya Bharathi Institute of Technology", value: "Chaitanya Bharathi Institute of Technology" },
    { name: "Vasavi College of Engineering, Hyderabad", value: "Vasavi College of Engineering, Hyderabad" },
    { name: "Vallurupalli Nageswara Rao Vignana Jyothi Institute of Engineering &Technology", value: "Vallurupalli Nageswara Rao Vignana Jyothi Institute of Engineering &Technology" },
    { name: "Mahatma Gandhi Institute of Technology", value: "Mahatma Gandhi Institute of Technology" },
    { name: "Gokaraju Rangaraju Institute of Engineering and Technology", value: "Gokaraju Rangaraju Institute of Engineering and Technology" },
    { name: "CVR College of Engineering", value: "CVR College of Engineering" },
    { name: "Vardhaman College of Engineering", value: "Vardhaman College of Engineering" },
    { name: "B.V. Raju Institute of Technology ", value: "B.V. Raju Institute of Technology " },
    { name: "Bvrit Hyderabad College of Engineering for Women", value: "Bvrit Hyderabad College of Engineering for Women" },
    { name: "Anurag Group of Institutions", value: "Anurag Group of Institutions" },
    { name: "CMR College of Engineering & Technology", value: "CMR College of Engineering & Technology" },
    { name: "Institute of Aeronautical Engineering, Dundigal", value: "Institute of Aeronautical Engineering, Dundigal" },
    { name: "Guru Nanak Institutions Technical Campus", value: "Guru Nanak Institutions Technical Campus" },
    { name: "MLR Institute of Technology", value: "MLR Institute of Technology" },
    { name: "Malla Reddy Engineering College", value: "Malla Reddy Engineering College " },
    { name: "Aditya Engineering College", value: "Aditya Engineering College" },
    { name: "University Of Calcutta", value: "University Of Calcutta" },
    { name: "Kalyani Goverment Engineering College,Kalyani,Nadia", value: "Kalyani Goverment Engineering College,Kalyani,Nadia" },
    { name: "Maulana Abul Kalam Azad University Of Technology", value: "Maulana Abul Kalam Azad University Of Technology" },
    { name: "Institute Of Engineering & Management, Salt Lake", value: "Institute Of Engineering & Management, Salt Lake" },
    { name: "Heritage Institute Of Technology, Kolkata", value: "Heritage Institute Of Technology, Kolkata" },
    { name: "Aliah University, New Town", value: "Aliah University, New Town" },
    { name: "Government College Of Engineering And Leather Technology, Kolkata", value: "Government College Of Engineering And Leather Technology, Kolkata" },
    { name: "Jalpaiguri Goverment Engineering College ,Jalpaiguri", value: "Jalpaiguri Goverment Engineering College ,Jalpaiguri" },
    { name: "Govt. College Of Engineering & Ceramic Technology, Kolkata", value: "Govt. College Of Engineering & Ceramic Technology, Kolkata" },
    { name: "Techno India-Salt Lake, Sector-V, Salt Lake", value: "Techno India-Salt Lake, Sector-V, Salt Lake" },
    { name: "Govt. College Of Engineering & Textile Technology, Serampore", value: "Govt. College Of Engineering & Textile Technology, Serampore" },
    { name: "Indian Institute of Engineering Science and Technology", value: "Indian Institute of Engineering Science and Technology" },
    { name: "Haldia Institute of Technology", value: "Haldia Institute of Technology" },
    { name: "University Institute Of Technology, Burdwan", value: "University Institute Of Technology, Burdwan" },
    { name: "St. Thomas College Of Engineering & Technology, Khidirpur, Kolkata", value: "St. Thomas College Of Engineering & Technology, Khidirpur, Kolkata" },
    { name: "RCC Institute Of Information Technology, Kolkata", value: "RCC Institute Of Information Technology, Kolkata" },
    { name: "Ramkrishna Mahato Government Engineering College, Purulia (Earlier Purulia Government Engineering College, Purulia)", value: "Ramkrishna Mahato Government Engineering College, Purulia (Earlier Purulia Government Engineering College, Purulia)" },
    { name: "Netaji Subhas Engineering College, Garia, Kolkata", value: "Netaji Subhas Engineering College, Garia, Kolkata" },
    { name: "Cooch Behar Government Engineering College, Cooch Behar", value: "Cooch Behar Government Engineering College, Cooch Behar" },
    { name: "Academy Of Technology, Adisaptagram, Hooghly", value: "Academy Of Technology, Adisaptagram, Hooghly" },
    { name: "B.P. Poddar Institute Of Management & Technology, Kolkata", value: "B.P. Poddar Institute Of Management & Technology, Kolkata" },
    { name: "Modern Institute Of Engineering & Technology,Bandel,Hooghly", value: "Modern Institute Of Engineering & Technology,Bandel,Hooghly" },
    { name: "Meghnad Saha Institute Of Technology, Kolkata", value: "Meghnad Saha Institute Of Technology, Kolkata" },
    { name: "Techno India College Of Technology, Rajarhat, New Town", value: "Techno India College Of Technology, Rajarhat, New Town" },
    { name: "Future Institute Of Engineering & Management,Sonarpur", value: "Future Institute Of Engineering & Management,Sonarpur" },
    { name: "Asansol Engineering College, Asansol, Burdwan", value: "Asansol Engineering College, Asansol, Burdwan" },
    { name: "Techno India University, Kolkata", value: "Techno India University, Kolkata" },
    { name: "MCKV Institute Of Engineering, Liluah, Howrah", value: "MCKV Institute Of Engineering, Liluah, Howrah" },
    { name: "Calcutta Institute of Engineering & Management", value: "Calcutta Institute of Engineering & Management" },
    { name: "Atal Bihari Vajpayee Indian Institute Of Information Technology- Gwalior", value: "Atal Bihari Vajpayee Indian Institute Of Information Technology- Gwalior" },
    { name: "Pandit Dwarka Prasad Mishra Indian Institute Of Information Technology, Design And Manufacturing, Jabalpur (IIITDM)", value: "Pandit Dwarka Prasad Mishra Indian Institute Of Information Technology, Design And Manufacturing, Jabalpur (IIITDM)" },
    { name: "Indian Institute of Information Technology, Chittoor", value: "Indian Institute of Information Technology, Chittoor" },
    { name: "Indian Institute of Information Technology, Vadodara", value: "Indian Institute of Information Technology, Vadodara" },
    { name: "Indian Institute of Information Technology, Una, HP", value: "Indian Institute of Information Technology, Una, HP" },
    { name: "SGSITS, Indore", value: "SGSITS, Indore" },
    { name: "Madhav Institute Of Technology And Science", value: "Madhav Institute Of Technology And Science" },
    { name: "Army Institute Of Technology", value: "Army Institute Of Technology" },
    { name: "Bharath Institute of Higher Education and Research", value: "Bharath Institute of Higher Education and Research" },
    { name: "B.S. A. Crescent Institute of Science & Technology", value: "B.S. A. Crescent Institute of Science & Technology" },
    { name: "L.D.College of Engineering, Ahmedabad", value: "L.D.College of Engineering, Ahmedabad" },
    { name: "Sardar Vallabhbhai Patel Institute of Technology (SVIT), Vasad", value: "Sardar Vallabhbhai Patel Institute of Technology (SVIT), Vasad" },
    { name: "Babaria Institute of Technology, Vadodara", value: "Babaria Institute of Technology, Vadodara" },
    { name: "SAL Institute of Technology & Engineering Research, Ahmedabad", value: "SAL Institute of Technology & Engineering Research, Ahmedabad" },
    { name: "SAL College of Engineering, Sola Road, Ahmedabad", value: "SAL College of Engineering, Sola Road, Ahmedabad" },
    { name: "SAL Education Campus, Ahmedabad", value: "SAL Education Campus, Ahmedabad" },
    { name: "Amity University, Jaipur", value: "Amity University, Jaipur" },
    { name: "Arya Institute of Engineering & Technology, Jaipur", value: "Arya Institute of Engineering & Technology, Jaipur" },
    { name: "Jaipur Engineering College & Research Centre, Jaipur", value: "Jaipur Engineering College & Research Centre, Jaipur" },
    { name: "Poornima Institute of Engineering & Technology, Jaipur", value: "Poornima Institute of Engineering & Technology, Jaipur" },
    { name: "Arya College of Engineering & Information Technology, Jaipur", value: "Arya College of Engineering & Information Technology, Jaipur" },
    { name: "Global Institute of Technology, Jaipur", value: "Global Institute of Technology, Jaipur" },
    { name: "Poornima College of Engineering, Jaipur", value: "Poornima College of Engineering, Jaipur" },
    { name: "Swami Keshwanand Institute of Technology Management & Gramothan, Jaipur", value: "Swami Keshwanand Institute of Technology Management & Gramothan, Jaipur" },
    { name: "Sathyabama Institute of Science and Technology", value: "Sathyabama Institute of Science and Technology" },
  ];
  discipline = [
    {
      name: 'Civil',
      value: 'Civil'
    },
    {
      name: 'Automobile',
      value: 'Automobile'
    },
    {
      name: 'Electrical',
      value: 'Electrical'
    },
    {
      name: 'Mining',
      value: 'Mining'
    },
    {
      name: 'Mechanical',
      value: 'Mechanical'
    },
    {
      name: 'Metallurgy',
      value: 'Metallurgy'
    },
    {
      name: 'Computer Science',
      value: 'Computer Science'
    },
    {
      name: 'Communications',
      value: 'Communications'
    },
    {
      name: 'Inst. & Control',
      value: 'Inst. & Control'
    },
    {
      name: 'Chemical',
      value: 'Chemical'
    },
    {
      name: 'Construction Management',
      value: 'Construction Management'
    },
    {
      name: 'Quantitative Surveying',
      value: 'Quantitative Surveying'
    },
    {
      name: 'Project Engg. & Mgmt.',
      value: 'Project Engg. & Mgmt.'
    },
    {
      name: 'Structural',
      value: 'Structural'
    },
    {
      name: 'Architecture',
      value: 'Architecture'
    },
    {
      name: 'Mech - Thermal',
      value: 'Mech - Thermal'
    },
    {
      name: 'Mech - Design',
      value: 'Mech - Design'
    },
    {
      name: 'Power Systems',
      value: 'Power Systems'
    },
    {
      name: 'Power Electronics & Drives',
      value: 'Power Electronics & Drives'
    },
    {
      name: 'Renewable Energy',
      value: 'Renewable Energy'
    },
    {
      name: 'Water Resources',
      value: 'Water Resources'
    },
    {
      name: 'Environmental',
      value: 'Environmental'
    },
    {
      name: 'Transportation Engg. & Mgmt',
      value: 'Transportation Engg. & Mgmt'
    },
    {
      name: 'Geotechnical',
      value: 'Geotechnical'
    },
    {
      name: 'Marine',
      value: 'Marine'
    },
  ];

  educationForm: FormGroup;

  startingYear = new Date("2005-01-01");
  endYear = new Date();
  dummystartDate = new Date("2005-01-01");
  dummyendDate = new Date("2020-07-07");
  dateFormat = 'yyyy/MM/dd';
  monthFormat = 'MMM yyyy';

  apiForm: any;
  educationValuearray: any;

  disabledYears = (current: Date): boolean => {

    // Can not select days before today and today
    return differenceInCalendarDays(current, this.startingYear) < 0;
  }
  disabledprevious = (current: Date): any => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.startingYear) < 0;
    // return differenceInCalendarDays(this.dummyendDate, this.dummystartDate) > 0;
  }


  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    if (!this.appConfig.getLocalData('confirmClick')) {
      this.appConfig.setLocalData('confirmClick', 'false');
    }

    this.FormInitialization();
    this.getLocalForm();

    if (this.appConfig.getLocalData('educationalFormTouched')) {
      this.appConfig.clearLocalDataOne('educationalFormTouched');
    }
    // tslint:disable-next-line: triple-equals
    if (this.appConfig.getLocalData('field_isformsubmitted') == 'true') {
      this.appConfig.setLocalData('educationalFormSubmitted', 'true');
    }

  }



  cancel() {
    this.ngOnInit();
    this.appConfig.nzNotification('success', 'Resetted', 'Educational details form has been resetted');
  }

  getLocalForm() {
    this.apiForm = JSON.parse(this.appConfig.getLocalData('kycForm'));
    if (this.apiForm['eduArr'] && this.apiForm['eduArr'].length > 0) {
      this.educationValuearray = this.apiForm['eduArr'];
    } else {
      this.educationValuearray = [];
    }

    this.FormInitialization();
  }

  onSubmit(OptA) {

    if (this.educationForm.valid) {

      console.log(this.educationForm.value);

      const edArrays = [];
      this.educationForm.value.educationArr.forEach((element, i) => {
        edArrays.push({ field_level: { value: element.leveling }, field_board_university: { value: element.board }, field_institute: { value: element.institute }, field_discipline: { value: element.discipline }, field_specification: { value: element.specification }, field_year_of_passing: { value: moment(element['passedYear']).format() }, field_backlogs: { value: element.backlogs }, field_percentage: { value: element.percentage } });
      });
      this.apiForm['eduArr'] = edArrays;
      // this.apiForm.field_level = { value: this.educationForm.value.educationArr[0]['leveling'] },
      //   this.apiForm.field_board_university = { value: this.educationForm.value.educationArr[0]['board'] },
      //   this.apiForm.field_institute = { value: this.educationForm.value.educationArr[0]['institute'] },
      //   this.apiForm.field_discipline = { value: this.educationForm.value.educationArr[0]['discipline'] },
      //   this.apiForm.field_specification = { value: this.educationForm.value.educationArr[0]['specification'] },
      //   this.apiForm.field_year_of_passing = { value: moment(this.educationForm.value.educationArr[0]['passedYear']).format() },
      //   this.apiForm.field_percentage = { value: this.educationForm.value.educationArr[0]['percentage'] },
      //   this.apiForm.field_backlogs = { value: this.educationForm.value.educationArr[0]['backlogs'] ? this.educationForm.value.educationArr[0]['backlogs'] : '' },

      this.appConfig.setLocalData('educationalFormSubmitted', 'true');
      this.appConfig.clearLocalDataOne('educationalFormTouched');
      this.appConfig.setLocalData('kycForm', JSON.stringify(this.apiForm));
      this.appConfig.setLocalData('confirmClick', 'true');
      this.appConfig.nzNotification('success', 'Submitted', 'Educational details has been updated');
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_FAMILY_DETAILS);

    } else {
      this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');
      this.validateAllFormArrays(this.educationForm.get('educationArr') as FormArray);
    }

  }



  educationPatch(dataArray) {
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(edu => {
        this.addEducationForm(edu);
      });
    } else {
      for (let i = 0; i <= 0; i++) {
        this.addEducationForm(null);
      }
    }
  }
  FormInitialization() {
    this.educationForm = this.fb.group({
      educationArr: this.fb.array([])
    }), this.educationPatch(this.educationValuearray);
  }


  createItem(edu): any {
    const onlyNumbers: RegExp = /^[1-9]\d*(\.\d+)?$/;
    const numberDecimals: RegExp = /^\d*(\.\d{0,2})?$/;
    const numberOnly: RegExp = /^[0-9][0-9]{0,1}$/;
    const percentageDecimals = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?%?$)/;
    if (edu) {

      return this.fb.group({
        leveling: [edu.field_level['value'], [RemoveWhitespace.whitespace(), Validators.required]],
        board: [edu.field_board_university['value'], [RemoveWhitespace.whitespace(), Validators.required]],
        institute: [edu.field_institute['value'], [Validators.required]],
        discipline: [edu.field_discipline['value'], [Validators.required]],
        specification: [edu.field_specification['value'], [RemoveWhitespace.whitespace(), Validators.required]],
        passedYear: [edu.field_year_of_passing['value'], [Validators.required]],
        backlogs: [edu.field_backlogs['value'], [Validators.pattern(numberOnly)]],
        percentage: [edu.field_percentage['value'], [Validators.required, Validators.pattern(percentageDecimals)]],
      });
    } else {
      return this.fb.group({
        leveling: [null, [RemoveWhitespace.whitespace(), Validators.required]],
        board: [null, [RemoveWhitespace.whitespace(), Validators.required]],
        institute: [null, [Validators.required]],
        discipline: [null, [Validators.required]],
        specification: [null, [RemoveWhitespace.whitespace(), Validators.required]],
        passedYear: [null, [Validators.required]],
        backlogs: [null, [Validators.pattern(numberOnly)]],
        percentage: [null, [Validators.required, Validators.pattern(percentageDecimals)]],
      });
    }
  }

  // convenience getters for easy access to form fields
  get eduArr() { return this.educationForm.get('educationArr') as FormArray; }

  removeEducationForm(i) {
    this.eduArr.removeAt(i);
  }


  addEducationForm(data?: any) {
    if (this.educationForm['status'] !== 'INVALID') {
      this.eduArr.push(this.createItem(data));
    } else {
      this.validateAllFormArrays(this.educationForm.get('educationArr') as FormArray);
    }
  }

  detectSelectChange() {
    this.appConfig.setLocalData('educationalFormTouched', 'true');
  }

  detectInput(form) {
    if (form.touched === true) {
      this.appConfig.setLocalData('educationalFormTouched', 'true');
    }
  }

  // To validate all fields after submit
  validateAllFormArrays(formArray: FormArray) {
    formArray.controls.forEach(formGroup => {
      Object.keys(formGroup['controls']).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          // if (control['status'] === 'INVALID') {
          //   console.log(control);
          //   this.appConfig.setLocalData('educationalFormSubmitted', 'false');
          // }
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFields(control);
        }
      });

    });
  }


  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  ngOnDestroy() {
    this.appConfig.clearLocalDataOne('educationalFormTouched');
  }
}
