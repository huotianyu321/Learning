using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Threading;

namespace Demo1
{
    public class Person
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public string Address { get; set; }

    }

    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class Window5 : Window
    {
        public Window5()
        {
            InitializeComponent();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var selectedItem = listbox.SelectedItem;
                var content = ((ContentControl)selectedItem).Content;
                textblock.Text = $"selectedItem={selectedItem}\r\ncontent={content}";
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
    }
}