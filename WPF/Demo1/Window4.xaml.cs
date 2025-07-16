using System.ComponentModel;
using System.Windows;
using System.Windows.Controls;
using System.Xml.Linq;

namespace Demo1
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class Window4 : Window, INotifyPropertyChanged
    {
        public Window4()
        {
            InitializeComponent();
            DataContext = this;//将当前窗体作为ViewModel赋值给当前窗体的DataContext
            Loaded += (s, e) =>
            {
                //计算滚动条的最大值
                Maximum = element.ActualWidth - viewport.ActualWidth;
            };
        }

        private double maximum = 0;
        /// <summary>
        /// 滚动条的最大值
        /// </summary>
        public double Maximum
        {
            get { return maximum; }
            set { maximum = value; NotifyPropertyChanged("Maximum"); }
        }

        private double x = 0;
        /// <summary>
        /// 滚动条的当前值
        /// </summary>
        public double X
        {
            get { return x; }
            set { x = value; CanvasLeft = -x; NotifyPropertyChanged("X"); }
        }

        private double canvasLeft = 0;
        /// <summary>
        /// 相对于Canvas控件Left边距
        /// </summary>
        public double CanvasLeft
        {
            get { return canvasLeft; }
            set { canvasLeft = value; NotifyPropertyChanged("CanvasLeft"); }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// 属性通知方法
        /// </summary>
        /// <param name="propertyName"></param>
        protected virtual void NotifyPropertyChanged(string propertyName)
        {
            if (this.PropertyChanged != null)
            {
                this.PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }
    }
}