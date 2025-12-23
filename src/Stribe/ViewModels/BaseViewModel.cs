using CommunityToolkit.Mvvm.ComponentModel;

namespace Stribe.ViewModels;

public partial class BaseViewModel : ObservableObject
{
    [ObservableProperty]
    private bool _isBusy;

    [ObservableProperty]
    private string _title = string.Empty;

    [ObservableProperty]
    private bool _isRefreshing;

    public bool IsNotBusy => !IsBusy;
}
