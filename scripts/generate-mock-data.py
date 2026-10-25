import json, calendar
from datetime import date

school_photos = [
 "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85",
 "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=85",
 "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85",
 "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85",
 "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=85",
 "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85"
]

teachers = [
 {"id":"t-priya","name":"Priya Sharma","photoUrl":"https://i.pravatar.cc/240?img=47","designation":"Mathematics Teacher","subjects":["Mathematics"],"highestDegree":"M.Sc. Mathematics","qualifications":[{"degree":"M.Sc. Mathematics","institution":"Banaras Hindu University","year":"2016"},{"degree":"B.Ed.","institution":"University of Allahabad","year":"2018"}],"experienceYears":9,"specialization":"Middle-school mathematics and problem-solving","about":"I enjoy helping students build confidence with mathematical concepts through examples, practice and patient guidance.","email":"priya.sharma@greenwood-demo.edu","phone":"+91 98765 43210","classes":["Class 5","Class 6","Class 7"],"languages":["English","Hindi"],"awards":["Innovative Teaching Practice Award · 2024"],"officeHours":"Monday–Friday · 2:30–3:30 PM"},
 {"id":"t-amit","name":"Amit Verma","photoUrl":"https://i.pravatar.cc/240?img=12","designation":"Physics Teacher","subjects":["Science","Physics"],"highestDegree":"M.Sc. Physics","qualifications":[{"degree":"M.Sc. Physics","institution":"IIT (BHU) Varanasi","year":"2015"},{"degree":"B.Ed.","institution":"Mahatma Gandhi Kashi Vidyapith","year":"2017"}],"experienceYears":11,"specialization":"Physics demonstrations and conceptual science","about":"My classes connect scientific ideas with everyday observations, experiments and curiosity-driven questions.","email":"amit.verma@greenwood-demo.edu","phone":"+91 98765 43211","classes":["Class 7","Class 8","Class 9"],"languages":["English","Hindi"],"awards":["Science Lab Mentor · 2023"],"officeHours":"Tuesday–Thursday · 1:45–2:30 PM"},
 {"id":"t-neha","name":"Neha Gupta","photoUrl":"https://i.pravatar.cc/240?img=44","designation":"English Teacher","subjects":["English"],"highestDegree":"M.A. English","qualifications":[{"degree":"M.A. English Literature","institution":"Banaras Hindu University","year":"2017"},{"degree":"B.Ed.","institution":"University of Allahabad","year":"2019"}],"experienceYears":7,"specialization":"Reading comprehension, writing and communication","about":"I encourage students to read widely, express ideas clearly and develop confidence in written communication.","email":"neha.gupta@greenwood-demo.edu","phone":"+91 98765 43212","classes":["Class 5","Class 8"],"languages":["English","Hindi"],"awards":["Reading Culture Champion · 2025"],"officeHours":"Monday–Wednesday · 2:00–2:45 PM"},
 {"id":"t-rohit","name":"Rohit Singh","photoUrl":"https://i.pravatar.cc/240?img=13","designation":"Computer Science Teacher","subjects":["Computer"],"highestDegree":"M.Tech. Computer Science","qualifications":[{"degree":"M.Tech. Computer Science","institution":"NIT Jamshedpur","year":"2017"},{"degree":"B.Ed.","institution":"IGNOU","year":"2020"}],"experienceYears":8,"specialization":"Digital literacy, computational thinking and coding","about":"I help students use technology thoughtfully while building logical thinking and practical digital skills.","email":"rohit.singh@greenwood-demo.edu","phone":"+91 98765 43213","classes":["Class 5","Class 8","Class 9"],"languages":["English","Hindi"],"awards":[],"officeHours":"Friday · 12:30–1:30 PM"},
 {"id":"t-sunita","name":"Sunita Patel","photoUrl":"https://i.pravatar.cc/240?img=49","designation":"Social Science Teacher","subjects":["Social Science"],"highestDegree":"M.A. History","qualifications":[{"degree":"M.A. History","institution":"Banaras Hindu University","year":"2014"},{"degree":"B.Ed.","institution":"University of Allahabad","year":"2016"}],"experienceYears":12,"specialization":"History, civics and project-based learning","about":"I make history and civics relatable through timelines, maps, discussions and local examples.","email":"sunita.patel@greenwood-demo.edu","phone":"+91 98765 43214","classes":["Class 5","Class 8","Class 9"],"languages":["English","Hindi"],"awards":["Outstanding Mentor · 2022"],"officeHours":"Wednesday · 1:00–2:00 PM"},
 {"id":"t-vikram","name":"Vikram Yadav","photoUrl":"https://i.pravatar.cc/240?img=15","designation":"Hindi Teacher","subjects":["Hindi"],"highestDegree":"M.A. Hindi","qualifications":[{"degree":"M.A. Hindi","institution":"Mahatma Gandhi Kashi Vidyapith","year":"2016"},{"degree":"B.Ed.","institution":"University of Allahabad","year":"2018"}],"experienceYears":10,"specialization":"Hindi literature, grammar and creative writing","about":"My goal is to help students appreciate language and communicate with clarity and imagination.","email":"vikram.yadav@greenwood-demo.edu","phone":"+91 98765 43215","classes":["Class 5","Class 8"],"languages":["Hindi","English"],"awards":[],"officeHours":"Tuesday · 2:30–3:00 PM"},
 {"id":"t-rakesh","name":"Rakesh Tiwari","photoUrl":"https://i.pravatar.cc/240?img=60","designation":"Former Mathematics Teacher","subjects":["Mathematics"],"highestDegree":"M.Sc. Mathematics","qualifications":[{"degree":"M.Sc. Mathematics","institution":"Banaras Hindu University","year":"2009"},{"degree":"B.Ed.","institution":"University of Allahabad","year":"2011"}],"experienceYears":15,"specialization":"Mathematics foundations and exam preparation","about":"Rakesh taught Mathematics at Greenwood in previous academic years, emphasizing clear methods and consistent practice.","email":"rakesh.tiwari@greenwood-demo.edu","phone":"+91 98765 43216","classes":["Class 4","Class 5","Class 6"],"languages":["English","Hindi"],"awards":["Academic Mentor Recognition · 2020"],"officeHours":"Historical faculty record","isActive":False}
]

subjects_for = [
 {"name":"Mathematics","teacherId":"t-priya","icon":"∑","color":"#7456D8"},
 {"name":"English","teacherId":"t-neha","icon":"Aa","color":"#E98A34"},
 {"name":"Science","teacherId":"t-amit","icon":"⚗","color":"#158BCE"},
 {"name":"Social Science","teacherId":"t-sunita","icon":"◎","color":"#20A67A"},
 {"name":"Computer","teacherId":"t-rohit","icon":"⌘","color":"#3469D8"},
 {"name":"Hindi","teacherId":"t-vikram","icon":"अ","color":"#D05CA8"}
]

month_names = ['April','May','June','July','August','September','October','November','December','January','February','March']

def attendance(year_start, month, seed, today=None):
    # 26 calendar dates, reproducible, excludes Sunday as no class, includes holidays.
    y = year_start + (1 if month <= 3 else 0)
    days_in = calendar.monthrange(y, month)[1]
    records=[]
    holiday_days={15}
    today = today or date.today()
    for d in range(1, days_in+1):
        day_date = date(y,month,d)
        weekday=day_date.weekday() # Mon=0
        if day_date > today:
            status='unmarked'
        elif weekday==6:
            status='noClass'
        elif d in holiday_days or (month==8 and d==15) or (month==10 and d==2):
            status='holiday'
        elif weekday==5 and d%2==0:
            status='noClass'
        else:
            v=(d*3+seed+month)%17
            status='absent' if v in [1,6] else 'present'
        records.append({'day':d,'date':f'{y:04d}-{month:02d}-{d:02d}','status':status})
    return {'month':calendar.month_name[month], 'monthNumber':month,'year':y,'records':records}

def build_child(child_id, name, gender, current_class, section, roll, photo, seed):
    today = date.today()
    years=[]
    year_defs=[('2026-27',2026,current_class),('2025-26',2025,current_class-1),('2024-25',2024,current_class-2),('2023-24',2023,current_class-3)]
    for yi,(label,start,grade) in enumerate(year_defs):
        months=[]
        months_active=7 if yi==0 else 12
        for mi in range(months_active):
            m = 4+mi
            if m>12: m-=12
            months.append(attendance(start,m,seed+mi+yi*2,today))
        # make class-specific current attendance summary from actual present/absent records to be consistent
        all_calendar_records=[r for mo in months for r in mo['records']]
        allrecs=[r for r in all_calendar_records if r['status'] in ('present','absent')]
        pres=sum(r['status']=='present' for r in allrecs); absn=sum(r['status']=='absent' for r in allrecs); holiday_count=sum(r['status']=='holiday' for r in all_calendar_records)
        subjects=[]
        subj_count=5 if grade>=5 else 4
        for si,s in enumerate(subjects_for[:subj_count]):
            teacher_for_year = 't-rakesh' if s['name'] == 'Mathematics' and yi >= 2 else s['teacherId']
            tests_templates=[
              ('Unit Test 1',f'{start}-05-12',18-si,20),
              ('Unit Test 2',f'{start}-07-26',16+((si+1)%4),20),
              ('Half-Yearly Examination',f'{start}-09-18',69+si*2,80),
              ('Unit Test 3',f'{start}-11-06',17+((si+2)%3),20),
              ('Pre-Board / Annual Practice',f'{start+1}-01-20',65+si*2,80),
              ('Annual Examination',f'{start+1}-03-10',72+((si*3)%8),80)
            ]
            if yi==0:
                tests_templates=tests_templates[:3]
            tests=[]
            for ti,(tname,tdate,score,maxscore) in enumerate(tests_templates):
                # keep the first two years of tests accessible for testing; some copies intentionally unavailable
                tests.append({'id':f'{child_id}-{label}-{si}-{ti}','name':tname,'date':tdate,'score':max(0,score-(seed%3)),'maxScore':maxscore,'teacherId':teacher_for_year,'copyAvailable': not (ti==1 and si==4),'teacherRemarks':['Keep practising regularly.','Good progress—focus on accuracy.','Very good effort this term.'][ti%3]})
            subjects.append({'id':f'{child_id}-{label}-subj-{si}','name':s['name'],'teacherId':teacher_for_year,'icon':s['icon'],'color':s['color'],'tests':tests})
        fee_months=[]
        fee_month_numbers = list(range(4, 11)) if yi==0 else list(range(4,13)) + list(range(1,4))
        months_fee = ['Admission'] + [f'{calendar.month_name[m]} {start if m>=4 else start+1}' for m in fee_month_numbers]
        for fi,fm in enumerate(months_fee):
            if fm=='Admission':
                breakdown={'Admission Fee':8500,'Security Deposit':2000,'Annual Charges':3500,'Student ID & Diary':350}
            else:
                breakdown={'Tuition Fee':3000+((seed+fi)%3)*100,'Transport Fee':1200 if child_id=='aarav' else 0,'Activity Fee':300,'Library Fee':200,'Other Charges':150}
            total=sum(breakdown.values())
            fee_months.append({'id':f'{child_id}-{label}-fee-{fi}','label':fm,'academicYear':label,'breakdown':breakdown,'total':total,'paid':True if fi < len(months_fee)-1 else seed%2==0,'paymentDate':f'{start if ((4+fi-2)%12+1)>=4 else start+1}-{((4+fi-2)%12+1):02d}-{10+(fi%15):02d}','paymentMode':['UPI','Net Banking','Cash'][fi%3],'transactionId':f'GW{str(start)[-2:]}{roll:03d}{fi:02d}A1'})
        years.append({'label':label,'startYear':start,'className':f'Class {grade}','section':section,'attendance':{'totalClasses':len(allrecs),'present':pres,'absent':absn,'holidays':holiday_count,'percentage':round(pres/max(1,pres+absn)*100),'months':months},'subjects':subjects,'feeReceipts':fee_months,'classTeacherId':'t-sunita' if grade>=8 else 't-priya'})
    current_start=current_class
    return {'id':child_id,'fullName':name,'photoUrl':photo,'studentId':f'2026-A-{current_class:02d}-{section}-{roll:03d}','className':f'Class {current_class}','section':section,'rollNumber':roll,'relationship':'Child','gender':gender,'dateOfBirth':'2016-02-18' if child_id=='aarav' else '2013-08-07','bloodGroup':'B+','admissionNumber':f'ADM-202{5-seed%2}-{roll:04d}','currentAcademicYear':'2026-27','academicYears':years}

children=[
 build_child('aarav','Aarav Sharma','Male',5,'A',12,'https://i.pravatar.cc/240?img=11',5),
 build_child('ananya','Ananya Sharma','Female',8,'B',7,'https://i.pravatar.cc/240?img=44',8)
]

notifs=[
 {'id':'n-1','type':'request','title':'Child access approved','message':'Your request to access Aarav Sharma’s profile has been approved.','dateLabel':'Today · 10:20 AM','read':False,'childId':'aarav'},
 {'id':'n-2','type':'update','title':'Half-yearly results published','message':'Mathematics and English results are now available for Aarav.','dateLabel':'Yesterday','read':False,'childId':'aarav'},
 {'id':'n-3','type':'update','title':'Fee receipt generated','message':'Your October fee receipt is available to download.','dateLabel':'2 days ago','read':True,'childId':'aarav'},
 {'id':'n-4','type':'request','title':'Leave request submitted','message':'Your leave request is waiting for school review.','dateLabel':'4 days ago','read':True,'childId':'ananya'},
 {'id':'n-5','type':'update','title':'School notice','message':'The school library will host a reading week next month.','dateLabel':'5 days ago','read':True},
 {'id':'n-6','type':'update','title':'Complaint updated','message':'Your transport concern has been marked as In Review.','dateLabel':'1 week ago','read':True,'childId':'aarav'}
]

mock={
 'app':{'name':'Greenwood International School','version':'1.0.0','demoMode':True,'appName':'Greenwood International School','appSlug':'greenwood-international-school','androidPackage':'com.greenwoodinternational.guardian','iosBundleIdentifier':'com.greenwoodinternational.guardian','defaultAcademicYear':'2026-27','availableAcademicYears':['2026-27','2025-26','2024-25','2023-24']},
 'school':{'id':'greenwood-demo','name':'Greenwood International School','tagline':'Learn · Grow · Succeed','heroPhotoUrl':school_photos[0],'logoEmoji':'✦','established':2010,'address':'RathYatra Road, Varanasi, Uttar Pradesh, India','shortLocation':'Varanasi, Uttar Pradesh','phone':'+91 542 400 2000','email':'hello@greenwood-demo.edu','website':'https://example.org/greenwood-demo','grades':'Nursery – Class 12','about':'Greenwood International School encourages curiosity, kindness and independent thinking. Our learning environment combines strong academic foundations with arts, sports, technology and a supportive school community.','mission':'To nurture confident, compassionate learners who are ready to contribute to their communities.','photos':school_photos,'videos':[{'id':'v1','title':'A day at Greenwood','duration':'2:18','thumbnailUrl':school_photos[2],'url':'https://www.youtube.com/watch?v=aqz-KE-bpKQ'},{'id':'v2','title':'Campus and facilities tour','duration':'3:42','thumbnailUrl':school_photos[3],'url':'https://www.youtube.com/watch?v=aqz-KE-bpKQ'},{'id':'v3','title':'Annual cultural showcase','duration':'4:05','thumbnailUrl':school_photos[4],'url':'https://www.youtube.com/watch?v=aqz-KE-bpKQ'}],'facilities':['Science and computer labs','Library and reading corner','Indoor and outdoor sports','Music and art studios','School transport','Counselling and student support'],'theme':{'primary':'#075DCE','primaryDark':'#073C88','accent':'#20A4F3','success':'#18A66A','danger':'#E34D59','warning':'#E99B25','background':'#F4F7FC','surface':'#FFFFFF','text':'#16233A','muted':'#687892','border':'#E3EAF3','purple':'#7456D8','orange':'#E98A34','successSoft':'#E7F8EF','dangerSoft':'#FFF0F0','warningSoft':'#FFF6E8','blueSoft':'#EAF3FF','purpleSoft':'#F1ECFF','orangeSoft':'#FFF0E5'}},
 'guardian':{'id':'guardian-demo-001','fullName':'Priya Sharma','mobileNumber':'+91 98765 43210','email':'priya.sharma@example.com','profilePhotoUrl':'https://i.pravatar.cc/240?img=47','address':'Varanasi, Uttar Pradesh, India','relationship':'Parent','profileComplete':True},
 'children':children,
 'teachers':teachers,
 'notifications':notifs,
 'complaints':[{'id':'cmp-001','childId':'aarav','subject':'Transport','message':'The bus was delayed this week. Please share an updated arrival schedule.','attachmentName':None,'status':'In Review','createdAt':'2026-10-18'}],
 'leaveRequests':[{'id':'leave-001','childId':'ananya','startDate':'2026-10-28','endDate':'2026-10-29','reason':'Family commitment','status':'Pending','createdAt':'2026-10-22'}],
 'linkRequests':[{'id':'link-001','studentId':'2026-A-05-A-012','studentName':'Aarav Sharma','status':'Approved','createdAt':'2026-10-01'}],
 'helpTopics':[
  {'id':'h1','title':'How do I add a child?','body':'Open Home, tap Add Child, enter the student ID exactly as printed on the school record, and provide the student’s full name. The principal reviews access requests.'},
  {'id':'h2','title':'How do I view attendance?','body':'Select your child, choose the academic year, then open Attendance. The calendar uses green for present, red for absent, blue for holidays and grey for non-school or unmarked days.'},
  {'id':'h3','title':'How do I download an answer copy?','body':'Open Results, choose a subject, and tap the download icon beside a test. If the school has uploaded a scanned copy, the app creates a demo PDF and opens the phone share sheet so you can save or open it in a PDF app.'},
  {'id':'h4','title':'How do I download a fee receipt?','body':'Open the child dashboard, choose Fees Receipt, select Admission or a fee month, review the fee breakdown and tap Download Receipt (PDF).'},
  {'id':'h5','title':'How do I raise a complaint?','body':'Choose Raise Complaint, select the child, enter a message and optionally attach a file. Submit sends the mock complaint to the principal’s notification list.'},
  {'id':'h6','title':'How do I submit a leave request?','body':'Choose Leave Request, select a child, pick start and end dates and optionally add a reason. A confirmation is added to your demo notifications.'},
  {'id':'h7','title':'How do I complete my profile?','body':'Your full name, mobile number, email and profile photo are required before you can submit a new child-link request. The guardian can edit the name and photo; mobile and email are read-only in this demo.'},
  {'id':'h8','title':'Contact the school','body':'Call +91 542 400 2000 or email hello@greenwood-demo.edu. These are sample contact details for the UI demo.'}
 ],
 'termsSections':[
  {'title':'1. Using the app','body':'This demo provides a parent-facing interface for school information, children’s records, fee receipts, leave requests and communication with the school.'},
  {'title':'2. Account responsibility','body':'Keep your sign-in details private and use the app only for student records you are authorized to access.'},
  {'title':'3. Accuracy of information','body':'Information shown in this build is illustrative sample data. In a live deployment, the school must maintain accurate, approved records.'},
  {'title':'4. Documents and downloads','body':'Answer-copy and receipt downloads are sample documents generated locally for testing. They are not official school records.'},
  {'title':'5. Changes to these terms','body':'The school may update the terms applicable to a production app and will publish the effective date when changes are made.'}
 ],
 'privacySections':[
  {'title':'1. Information shown','body':'The demo uses mock names, photos, contact information, attendance, fee and academic records. Do not enter real student information while testing.'},
  {'title':'2. Local demo behavior','body':'Profile changes, child requests, complaints and leave requests are kept only in application memory in this demo unless a later implementation adds persistent storage.'},
  {'title':'3. Sensitive student data','body':'A production app must restrict child records to approved guardians and authorized school staff, enforce tenant-level access controls and use secure transport and storage.'},
  {'title':'4. Attachments and PDFs','body':'Attachments are selected only in demo UI and generated PDFs are sample documents. Review local storage and permissions before enabling real data.'},
  {'title':'5. Contact','body':'For this mock school, contact hello@greenwood-demo.edu. Replace these demo details with the school’s approved privacy contact before release.'}
 ]
}
config={'app':mock.pop('app'),'school':mock.pop('school')}
with open('src/data/school-config.json','w',encoding='utf-8') as f:
 json.dump(config,f,ensure_ascii=False,indent=2)
with open('src/data/mock-data.json','w',encoding='utf-8') as f:
 json.dump(mock,f,ensure_ascii=False,indent=2)
print('wrote mock data with',len(children),'children,',len(teachers),'teachers')
