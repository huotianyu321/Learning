using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Diagnostics;

namespace Demo1
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            // 订阅 SourceInitialized 事件
            this.SourceInitialized += OnSourceInitialized;

            this.Activated += (s, e) => Debug.WriteLine("2.MainWindow的Activated被执行");
            this.Loaded += (s, e) => Debug.WriteLine("3.MainWindow的Loaded被执行");
            this.ContentRendered += (s, e) => Debug.WriteLine("4.MainWindow的ContentRendered被执行");
            this.Deactivated += (s, e) => Debug.WriteLine("5.MainWindow的Deactivated被执行");
            this.Closing += (s, e) => Debug.WriteLine("6.MainWindow的Closing被执行");
            this.Closed += (s, e) => Debug.WriteLine("7.MainWindow的Closed被执行");
            this.Unloaded += (s, e) => Debug.WriteLine("8.MainWindow的Unloaded被执行");
        }

        // 定义处理方法
        private void OnSourceInitialized(object sender, EventArgs e)
        {
            Debug.WriteLine("1.MainWindow的SourceInitialized被执行");
        }

    }
}