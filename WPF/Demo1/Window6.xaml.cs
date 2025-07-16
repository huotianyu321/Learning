using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Runtime.CompilerServices;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Threading;

namespace Demo1
{
    public class ObservableObject : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        public void RaisePropertyChanged([CallerMemberName] string propertyName = "")
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
    public class MyPerson : ObservableObject
    {
        private string name;
        public string Name
        {
            get { return name; }
            set { name = value; RaisePropertyChanged(); }
        }

        private int age;
        public int Age
        {
            get { return age; }
            set { age = value; RaisePropertyChanged(); }
        }

        private string address;
        public string Address
        {
            get { return address; }
            set { address = value; RaisePropertyChanged(); }
        }
    }

    public class MainViewModel : ObservableObject
    {
        private MyPerson person;
        public MyPerson Person
        {
            get { return person; }
            set { person = value; RaisePropertyChanged(); }
        }

        public MainViewModel()
        {
            person = new MyPerson
            {
                Name = "张三",
                Age = 50,
                Address = "居无定所",
            };
        }
    }

    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class Window6 : Window
    {
        public Window6()
        {
            InitializeComponent();

            this.DataContext = new MainViewModel();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            var vm = DataContext as MainViewModel;

            if (vm == null) return;

            vm.Person.Age = new Random().Next(1, 100);
            vm.Person.Address = DateTime.Now.ToString();
        }
    }
}