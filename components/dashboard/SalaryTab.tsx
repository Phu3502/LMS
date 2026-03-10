// components/dashboard/SalaryTab.tsx
'use client';

// Mock data cho bảng lương
const mockClasses = [
  {
    __backendId: '1',
    class_id: 'MATH101',
    class_name: 'Toán 10',
    rate_per_session: 300000,
    color: '#3b82f6',
  },
  {
    __backendId: '2',
    class_id: 'PHY201',
    class_name: 'Vật lý 11',
    rate_per_session: 350000,
    color: '#10b981',
  },
];

const mockAttendance = [
  { class_id: '1', approval_status: 'approved', payment_status: 'paid' },
  { class_id: '1', approval_status: 'approved', payment_status: 'paid' },
  { class_id: '1', approval_status: 'approved', payment_status: 'unpaid' },
  { class_id: '2', approval_status: 'approved', payment_status: 'paid' },
  { class_id: '2', approval_status: 'pending', payment_status: 'unpaid' },
  { class_id: '2', approval_status: 'approved', payment_status: 'unpaid' },
];

export default function SalaryTab() {
  const classes = mockClasses;
  const attendanceRecords = mockAttendance;

  // Tính tổng lương
  let totalApproved = 0;
  let totalPending = 0;
  let totalPaid = 0;
  let approvedSessions = 0;
  let pendingSessions = 0;
  let paidSessions = 0;

  const classSalary = classes.map(cls => {
    const classAttendance = attendanceRecords.filter(a => a.class_id === cls.__backendId);
    const approved = classAttendance.filter(a => a.approval_status === 'approved');
    const pending = classAttendance.filter(a => a.approval_status === 'pending');
    const paid = classAttendance.filter(a => a.payment_status === 'paid');

    const approvedAmount = approved.length * cls.rate_per_session;
    const pendingAmount = pending.length * cls.rate_per_session;
    const paidAmount = paid.length * cls.rate_per_session;

    totalApproved += approvedAmount;
    totalPending += pendingAmount;
    totalPaid += paidAmount;
    approvedSessions += approved.length;
    pendingSessions += pending.length;
    paidSessions += paid.length;

    const paymentStatus = paid.length === approved.length && approved.length > 0 ? 'Đã thanh toán' :
                          approved.length > 0 ? 'Chưa thanh toán' : 'Chưa có';
    const statusColor = paymentStatus === 'Đã thanh toán' ? 'emerald' :
                        paymentStatus === 'Chưa thanh toán' ? 'amber' : 'slate';

    return (
      <tr key={cls.__backendId} className="hover:bg-slate-50 transition-colors">
        <td className="px-6 py-4">
          <span className="font-medium" style={{ color: cls.color }}>{cls.class_id}</span>
        </td>
        <td className="px-6 py-4 font-medium text-slate-800">{cls.class_name}</td>
        <td className="px-6 py-4 text-center">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold">
            {approved.length}
          </span>
        </td>
        <td className="px-6 py-4 text-right text-slate-600">
          {new Intl.NumberFormat('vi-VN').format(cls.rate_per_session)} ₫
        </td>
        <td className="px-6 py-4 text-right font-bold text-emerald-600">
          {new Intl.NumberFormat('vi-VN').format(approvedAmount)} ₫
        </td>
        <td className="px-6 py-4 text-center">
          <span className={`status-badge bg-${statusColor}-100 text-${statusColor}-700`}>
            {paymentStatus}
          </span>
        </td>
      </tr>
    );
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Bảng lương cá nhân</h2>
        <p className="text-slate-500 mt-1">Theo dõi thu nhập từ các lớp học</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-emerald-100 text-sm mb-1">Tổng lương đã duyệt</p>
          <p className="text-3xl font-bold">{new Intl.NumberFormat('vi-VN').format(totalApproved)} ₫</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-100 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{approvedSessions} buổi đã duyệt</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-amber-100 text-sm mb-1">Lương chờ duyệt</p>
          <p className="text-3xl font-bold">{new Intl.NumberFormat('vi-VN').format(totalPending)} ₫</p>
          <div className="mt-4 flex items-center gap-2 text-amber-100 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{pendingSessions} buổi chờ duyệt</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-blue-100 text-sm mb-1">Đã thanh toán</p>
          <p className="text-3xl font-bold">{new Intl.NumberFormat('vi-VN').format(totalPaid)} ₫</p>
          <div className="mt-4 flex items-center gap-2 text-blue-100 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{paidSessions} buổi đã thanh toán</span>
          </div>
        </div>
      </div>

      {/* Bảng chi tiết lương */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Chi tiết lương theo lớp</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Mã lớp</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Tên lớp</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Buổi đã duyệt</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Rate/buổi</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Tổng lương</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classSalary}
            </tbody>
          </table>
        </div>
        {classes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">Chưa có dữ liệu lương</p>
          </div>
        )}
      </div>
    </div>
  );
}