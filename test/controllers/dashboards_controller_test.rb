require "test_helper"

class DashboardsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @dashboard = dashboards(:one)
  end

  test "should get index" do
    get dashboards_url, as: :json
    assert_response :success
  end

  test "should create dashboard" do
    assert_difference('Beer.count') do
      post dashboards_url, params: { dashboard: { description: @dashboard.description, name: @dashboard.name } }, as: :json
    end

    assert_response 201
  end

  test "should show dashboard" do
    get dashboard_url(@dashboard), as: :json
    assert_response :success
  end

  test "should update dashboard" do
    patch dashboard_url(@dashboard), params: { dashboard: { description: @dashboard.description, name: @dashboard.name } }, as: :json
    assert_response 200
  end

  test "should destroy dashboard" do
    assert_difference('Beer.count', -1) do
      delete dashboard_url(@dashboard), as: :json
    end

    assert_response 204
  end
end
