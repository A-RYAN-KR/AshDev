

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) => (
    <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-semibold mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </div>
);

export default StatCard