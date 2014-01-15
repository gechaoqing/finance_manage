package controllers;

import play.mvc.Controller;

/**
 * Created by Administrator on 14-1-15.
 */
public class ManageImport extends Controller {
//    public static void importStudentsExcel(File excel, Long teacherid) {
//        Sheet childSheet = getWorkBookSheet(excel);
//        Managers m = SchoolResManage.getCacheManager();
//        int rowNum = childSheet.getLastRowNum();
//        List<Student> students = new ArrayList<Student>();
//        Teacher t = null;
//        if (teacherid != -1) {
//            t = Teacher.findById(teacherid);
//        }
//        for (int j = 0; j <= rowNum; j++) {
//            Row row = childSheet.getRow(j);
//            if (j == 0) {
//                String stuNo = getCellStr(row, 0);
//                String name = getCellStr(row, 1);
//                String mobile = getCellStr(row, 2);
//                String teacher = getCellStr(row, 3);
//                if ("学号".equals(stuNo) && "姓名".equals(name)
//                        && "手机号".equals(mobile) && "老师".equals(teacher)) {
//                    continue;
//                } else {
//                    break;
//                }
//            } else {
//                String stuNo = getCellStr(row, 0);
//                String name = getCellStr(row, 1);
//                String mobile = getCellStr(row, 2);
//                if (("".equals(name) || name == null)
//                        && ("".equals(mobile) || mobile == null)) {
//                    continue;
//                }
//                Student stu = new Student();
//                stu.studentNo = stuNo;
//                stu.name = name;
//                stu.mobile = mobile;
//                if (teacherid == -1) {
//                    String teacher = getCellStr(row, 3);
//                    if (teacher != null && !"".equals(teacher.trim())) {
//                        Teacher t1 = Teacher.find("name=? and school_id=?",
//                                teacher, m.school.id).first();
//                        stu.teacher = t1;
//                        stu.school = t1.school;
//                    }
//                } else {
//                    stu.teacher = t;
//                    stu.school = t.school;
//                }
//                students.add(stu);
//            }
//        }
//        Cache.set(IMPORT_STUDENTS, students);
//        Gson gson = JSON.filter(null, List.class);
//        String listStr = gson.toJson(students);
//        renderJSON(listStr);
//    }
}
