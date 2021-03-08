require 'rails_helper'
# rubocop:disable Layout/LineLength
RSpec.describe 'Products', type: :request do
  let!(:category) { create(:category) }
  let!(:user) { create(:user, admin: true) }
  let!(:products) { create_list(:product, 20, category_id: category.id, user_id: user.id) }
  let(:category_id) { category.id }
  let(:user_id) { user.id }
  let(:id) { products.first.id }
  let(:headers) { valid_headers }

  describe 'GET /admin/products' do
    before { get '/admin/products', params: {}, headers: headers }

    it 'returns products' do
      expect(json).not_to be_empty
      expect(json.size).to eq(20)
    end

    it 'returns status code 200' do
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET /admin/products/:id' do
    before { get "/admin/products/#{id}", params: {}, headers: headers }

    context 'when the record exists' do
      it 'returns the product' do
        expect(json).not_to be_empty
        expect(json['id']).to eq(id)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the record does not exist' do
      let(:id) { 1000 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Product/)
      end
    end
  end

  describe 'POST /admin/products' do
    let(:valid_attributes) { { title: 'Visit Narnia', description: 'test post Visit Narnia', category_id: category_id, imageurl: 'url' }.to_json }

    context 'when request attributes are valid' do
      before { post '/admin/products', params: valid_attributes, headers: headers }

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end
    end

    context 'when an invalid request' do
      let(:invalid_attributes) { { title: nil }.to_json }
      before { post '/admin/products', params: invalid_attributes, headers: headers }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns a failure message' do
        expect(response.body).to match(/Validation failed/)
      end
    end
  end

  describe 'PUT /admin/products/:id' do
    let(:valid_attributes) { { title: 'Mozart artist' }.to_json }

    before { put "/admin/products/#{id}", params: valid_attributes, headers: headers }

    context 'when product exists' do
      it 'returns status code 204' do
        expect(response).to have_http_status(204)
      end

      it 'updates the product' do
        updated_product = Product.find(id)
        expect(updated_product.title).to match(/Mozart/)
      end
    end

    context 'when the product does not exist' do
      let(:id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Product/)
      end
    end
  end

  describe 'DELETE /admin/products/:id' do
    before { delete "/admin/products/#{id}", params: {}, headers: headers }

    it 'returns status code 204' do
      expect(response).to have_http_status(204)
    end
  end
end
# rubocop:enable  Layout/LineLength
